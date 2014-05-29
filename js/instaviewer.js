/*
 * instaviewer.js
 * AngularJS module for InstaViewer
 * Sandra Liljeqvist, May 2014
 */

// Create the AngularJS module
var app = angular.module("instaViewerModule", ['ngAnimate', 'ngRoute']);

// Routing for the home and about page
app.config(function($routeProvider) {
    $routeProvider.when('/', {
        controller: 'instaViewerController',
        templateUrl: 'home.html'
    })
    .when('/about', {
        templateUrl: 'about.html'
    })
    .otherwise({redirectTo: '/'});
});

// A factory for loading images
app.factory('dataFactory', function ($http){

    return {
        fetchByTag: function(tag, max_id, callback) {
            console.log('tag: '+tag);
            console.log('max: '+max_id);
            var endPoint = "https://api.instagram.com/v1/tags/" + tag + "/media/recent?callback=?&amp;client_id=" + scope.clientID + "&callback=JSON_CALLBACK";
            if (typeof max_id === 'string' && max_id.trim() !== '') {
                endPoint += "&max_id=" + max_id;
            }
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        },

        fetchPopular: function(callback) {
            var endPoint = "https://api.instagram.com/v1/media/popular?client_id=90e6e6c76291440b9e06a1a492b0ba00&callback=JSON_CALLBACK";   
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        },

        fetchByName: function(name, callback)  {
            console.log('name: '+name);
            var endPoint = "https://api.instagram.com/v1/users/search?q=" + name + "&client_id=" + scope.clientID + "&callback=JSON_CALLBACK";
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        },

        fetchByUserId: function(id, max_id, callback) {
            console.log('id '+id);
            console.log('max: '+max_id);
            var endPoint = "https://api.instagram.com/v1/users/" + id + "/media/recent/?client_id=" + scope.clientID + "&callback=JSON_CALLBACK";
            if (typeof max_id === 'string' && max_id.trim() !== '') {
                console.log('added max: '+max_id);
                endPoint += "&max_id=" + max_id;
            }
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        }
    }
});

// If we have scrolled to the bottom of the page - load new pictures
app.directive('onScroll', function(dataFactory) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {  
            $(window).scroll(function() {
                var scroll = $(window).scrollTop() + $(window).height();
                if (scroll == $(document).height()) {
                    setTimeout( function() {
                        if (scroll == $(document).height()) {
                            console.log('load more');
                            if (scope.searchType == "User") {
                                console.log("get more pics from user");
                                dataFactory.fetchByUserId(scope.userId, scope.next, function(newdata){
                                    for (var i in newdata.data) {
                                        scope.pics.push(newdata.data[i]);
                                    }
                                    scope.next = newdata.pagination.next_max_id;
                                });
                            } else {
                                console.log("get more pics from tag");
                                dataFactory.fetchByTag(scope.searchValue, scope.next, function(data) {
                                    scroll = $(window).scrollTop() + $(window).height();
                                    for (var i in data.data) {
                                        scope.pics.push(data.data[i]);
                                    }
                                    scope.next = data.pagination.next_max_id;
                                });
                            }
                        }
                    }, 100);
                }
            });
        }
    };
});


// Controller
app.controller('instaViewerController', function($scope, dataFactory) {

    // Variables
    window.scope = $scope;
    $scope.clientID = "90e6e6c76291440b9e06a1a492b0ba00";
    $scope.pics = [];
    $scope.next = "";
    $scope.searchValue = "view";
    $scope.searchType = "Tag";
    $scope.query = "";
    $scope.layout = 'grid'; 
    $scope.userId = "";

    // Get pictures and next max id on page load
    dataFactory.fetchByTag($scope.searchValue, $scope.next, function(data){
        console.log("initial search");
        $scope.data = data;
        $scope.pics = data.data;
    });

    //Set search type
    $scope.setSearchType = function(type) {
        $scope.searchType = type;
        console.log('set search type: '+$scope.searchType);
    }

    // Search for user or tag dependent on the searchType variable
    $scope.search = function() {
        console.log("search function");
        $scope.next = "";
        $scope.userId = "";
        if ($scope.searchType=="User") {
            console.log("search for user");
            dataFactory.fetchByName($scope.searchValue, function(data){
                $scope.userId = data.data[0].id;
                dataFactory.fetchByUserId($scope.userId, $scope.next, function(newdata){
                    $scope.pics = newdata.data;
                    $scope.next = newdata.pagination.next_max_id;
                });
            });
        } else {
            console.log("search for tag");
            dataFactory.fetchByTag($scope.searchValue, $scope.next, function(data){
                $scope.pics = data.data;
                $scope.next = data.pagination.next_max_id;
            });
        }
    }

    // Reoload the page
    $scope.reload = function() {
        console.log("reload page");
        $scope.next = "";
        $(window).scrollTop(0);
        $scope.search();
    }

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
            $scope.searchValue = "";
        } else if (clearable === 'filter') {
            $scope.query = "";
        }
    }

    // Variables for lightbox
    $scope.lightbox = false;
    $scope.lightboxUserImg = "";
    $scope.lightboxName = "";
    $scope.lightboxCount = "";
    $scope.lightboxSrc = "";
    $scope.lightboxCaption = "";

    // Set the variables and open the lightbox
    $scope.setLightbox = function(p) {
        $scope.lightbox = true;
        $scope.lightboxUserImg = p.user.profile_picture;
        $scope.lightboxName = p.user.full_name;
        $scope.lightboxCount = p.likes.count;
        $scope.lightboxSrc = p.images.standard_resolution.url;
        $scope.lightboxCaption = p.caption.text;
        $(".lightbox .listImg img").load(function() {
            var left = ($(window).width()-$('.lightbox').outerWidth())/2;
            var top = ($(window).height()-$('.lightbox').outerHeight())/2;
            $('.lightbox').css('left', left+'px');
            $('.lightbox').css('top', top+'px');
        });
    }

    // Check if the lightbox is open
    $scope.isLightboxOpen = function() {
        return $scope.lightbox;
    }

    // Close the lightbox
    $scope.closeLightbox = function() {
        $scope.lightbox = false;
    }

});
