/*
 * directive-onscroll.js
 * Directive for loading new pictures when scrolled to bottom of page
 * Sandra Liljeqvist, May 2014
 */

'use strict';

app.directive('onScroll', function(dataFactory) {
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            $(window).scroll(function() {
                var scroll = $(window).scrollTop() + $(window).height();
                if (scroll === $(document).height()) {
                    setTimeout( function() {
                        if (scroll === $(document).height()) { //load more
                            if (scope.searchType === "User") { // get more pics from user
                                dataFactory.fetchByUserId(scope.userId, scope.next, function(newdata){
                                    for (var i in newdata.data) {
                                        scope.pics.push(newdata.data[i]);
                                    }
                                    scope.next = newdata.pagination.nextMaxId;
                                });
                            } else { // get more pics from tag
                                dataFactory.fetchByTag(scope.searchValue, scope.next, function(data) {
                                    scroll = $(window).scrollTop() + $(window).height();
                                    for (var i in data.data) {
                                        scope.pics.push(data.data[i]);
                                    }
                                    scope.next = data.pagination.nextMaxId;
                                });
                            }
                        }
                    }, 100);
                }
            });
        }
    };
});