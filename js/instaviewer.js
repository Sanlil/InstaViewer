/*
 * instaviewer.js
 * AngularJS module for InstaViewer
 * Sandra Liljeqvist, May 2014
 */

'use strict';

// Create the AngularJS module
var app = angular.module('instaViewerModule', ['ngAnimate', 'ngRoute']);

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