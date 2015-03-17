'use strict';

var app = angular.module('trigger');

app.directive('lastfmImg', ['$rootScope', '$http', function($rootScope, $http) {
  return {
    restrict: 'A',
    scope: {
      ngSrc: '@',
      lastfmImg: '@'
    },
    link: function(scope, element, attrs) {
      attrs.$observe('lastfmImg', function(value) {
        var track = value.split(',');
//        console.log(track);
        if (track[0] !== undefined && track[0].length > 0) {
          var request = new XMLHttpRequest();
          request.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=4366bdedfe39171be1b5581b52ddee90&artist=' + track[1] + '&track=' + track[0] + '&autocorrect=1&format=json', true);
          request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
              // Success!
              var data = JSON.parse(request.responseText);
//              console.log(data.track.album.image[1]['#text']);
              element.attr('src', data.track.album.image[1]['#text']);
            } else {
              // We reached our target server, but it returned an error
            }
          };
          request.onerror = function() {
            // There was a connection error of some sort
          };
          request.send();
        }
      });
    }
  };
}]);
//        scope.$watch('ngSrc', function(newVal) {
//          element.removeClass('in');
//        });
//
//http://ws.audioscrobbler.com/2.0/?artist=Culprate&track=In+The+End&autocorrect=1&method=track.getInfo&api_key=4366bdedfe39171be1b5581b52ddee90&callback=jsonp1426614240550&format=json
