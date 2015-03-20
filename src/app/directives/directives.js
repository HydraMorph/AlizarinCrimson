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
              if (data.track !== undefined) {
                if (data.track.album !== undefined) {
                  if (data.track.album.image[1]['#text'] !== undefined) {
                    element.attr('src', data.track.album.image[1]['#text']);
                  }
                } else {
                  var fallbackRequest = new XMLHttpRequest();
                  fallbackRequest.open('GET', 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=4366bdedfe39171be1b5581b52ddee90&artist=' + track[1] + '&autocorrect=1&format=json', true);
                  fallbackRequest.onload = function() {
                    if (fallbackRequest.status >= 200 && fallbackRequest.status < 400) {
                      // Success!
                      var data = JSON.parse(fallbackRequest.responseText);
//                      console.log('fallbackRequest', data);
                      if (data.artist !== undefined) {
                        if (data.artist.image[1]['#text'] !== undefined) {
                          element.attr('src', data.artist.image[1]['#text']);
                        }
                      }
                    } else {
                      // We reached our target server, but it returned an error
                    }
                  };
                  fallbackRequest.onerror = function() {
                    // There was a connection error of some sort
                  };
                  fallbackRequest.send();
                }
              }
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

app.directive('compile', ['$compile', function ($compile) {
  return function(scope, element, attrs) {
    scope.$watch(
      function(scope) {
        // watch the 'compile' expression for changes
        return scope.$eval(attrs.compile);
      },
      function(value) {
        // when the 'compile' expression changes
        // assign it into the current DOM
        element.html(value);

        // compile the new DOM and link it to the current
        // scope.
        // NOTE: we only compile .childNodes so that
        // we don't get into infinite loop compiling ourselves
        $compile(element.contents())(scope);
      }
    );
  };
}]);


app.directive('trackId', ['$rootScope', 'socket', 'Client', function($rootScope, socket, Client) {
  return {
    restrict: 'AEC',
    scope: {
      class: '@'
    },
    link: function(scope, element, attrs) {
      Client.track(attrs.trackId, function(data) {
        element.html(data.a + ' - ' + data.t);
      });
    }
  };
}]);
