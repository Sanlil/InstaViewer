/*
 * datafactory.js
 * A factory for loading images
 * Sandra Liljeqvist, May 2014
 */

'use strict';

app.factory('dataFactory', function ($http){

    return {
        fetchByTag: function(tag, maxId, callback) {
            var endPoint = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?callback=?&amp;client_id=' + scope.clientID + '&callback=JSON_CALLBACK';
            if (typeof maxId === 'string' && maxId.trim() !== '') {
                endPoint += '&maxId=' + maxId;
            }
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        },

        fetchPopular: function(callback) {
            var endPoint = 'https://api.instagram.com/v1/media/popular?client_id=90e6e6c76291440b9e06a1a492b0ba00&callback=JSON_CALLBACK';
            $http.jsonp(endPoint).success(function(response) {
                callback(response);
            });
        },

        fetchByName: function(name, callback)  {
            var endPoint = 'https://api.instagram.com/v1/users/search?q=' + name + '&client_id=' + scope.clientID + '&callback=JSON_CALLBACK';
            $http.jsonp(endPoint).success(function(response){
                callback(response);
            });
        },

        fetchByUserId: function(id, maxId, callback) {
            var endPoint = 'https://api.instagram.com/v1/users/' + id + '/media/recent/?client_id=' + scope.clientID + '&callback=JSON_CALLBACK';
            if (typeof maxId === 'string' && maxId.trim() !== '') {
                endPoint += '&maxId=' + maxId;
            }
            $http.jsonp(endPoint).success(function(response) {
                callback(response);
            });
        }
    };
});