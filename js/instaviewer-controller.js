/*
 * instaviewer.js
 * Controller for InstaViewer
 * Sandra Liljeqvist, May 2014
 */

'use strict';

app.controller('instaViewerController', function($scope, dataFactory) {

    // Variables
    window.scope = $scope;
    $scope.clientID = '90e6e6c76291440b9e06a1a492b0ba00';
    $scope.pics = [];
    $scope.next = '';
    $scope.searchValue = 'view';
    $scope.searchType = 'Tag';
    $scope.query = '';
    $scope.layout = 'grid';
    $scope.userId = '';

    // Get pictures and next max id on page load
    dataFactory.fetchByTag($scope.searchValue, $scope.next, function(data) {
        $scope.data = data;
        $scope.pics = data.data;
    });

    //Set search type
    $scope.setSearchType = function(type) {
        $scope.searchType = type;
    };

    // Search for user or tag dependent on the searchType variable
    $scope.search = function() {
        $scope.next = '';
        $scope.userId = '';
        if ($scope.searchType==='User') { // search for user
            dataFactory.fetchByName($scope.searchValue, function(data) {
                $scope.userId = data.data[0].id;
                dataFactory.fetchByUserId($scope.userId, $scope.next, function(newdata) {
                    $scope.pics = newdata.data;
                    $scope.next = newdata.pagination.nextMaxId;
                });
            });
        } else { // search for tag
            dataFactory.fetchByTag($scope.searchValue, $scope.next, function(data){
                $scope.pics = data.data;
                $scope.next = data.pagination.nextMaxId;
            });
        }
    };

    // Reoload the page
    $scope.reload = function() {
        $scope.next = '';
        $(window).scrollTop(0);
        $scope.search();
    };

    // Set layout
    $scope.setLayout = function(layout){
        $scope.layout = layout;
    };
    
    // Check if a specific layout type is true
    $scope.isLayout = function(layout){
        return $scope.layout === layout;
    };

    //Clear text fields
    $scope.clear = function(clearable) {
        if (clearable === 'search') {
            $scope.searchValue = '';
        } else if (clearable === 'filter') {
            $scope.query = '';
        }
    };

    // Variables for lightbox
    $scope.lightbox = false;
    $scope.lightboxUserImg = '';
    $scope.lightboxName = '';
    $scope.lightboxCount = '';
    $scope.lightboxSrc = '';
    $scope.lightboxCaption = '';

    // Set the variables and open the lightbox
    $scope.setLightbox = function(p) {
        $scope.lightbox = true;
        $scope.lightboxUserImg = p.user.profile_picture;
        $scope.lightboxName = p.user.full_name;
        $scope.lightboxCount = p.likes.count;
        $scope.lightboxSrc = p.images.standard_resolution.url;
        $scope.lightboxCaption = p.caption.text;
        $('.lightbox .listImg img').load(function() {
            var left = ($(window).width()-$('.lightbox').outerWidth())/2;
            var top = ($(window).height()-$('.lightbox').outerHeight())/2;
            $('.lightbox').css('left', left+'px');
            $('.lightbox').css('top', top+'px');
        });
    };

    // Check if the lightbox is open
    $scope.isLightboxOpen = function() {
        return $scope.lightbox;
    };

    // Close the lightbox
    $scope.closeLightbox = function() {
        $scope.lightbox = false;
    };

});