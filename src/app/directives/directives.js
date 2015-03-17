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
        console.log(track);
        if (track[0] !== undefined && track[0].length > 0) {
          $http({method: 'GET', url: 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=66101f9355c9c707b5608bc42c62d860&artist=' + track[0] + '&track=' + track[1] + '&format=json', cache: true, headers:{
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
            }}).then(function(result) {
              alert('loaded ' + result.data.length + " bytes");
          });
        }
      });
    }
  };
}]);
//        scope.$watch('ngSrc', function(newVal) {
//          element.removeClass('in');
//        });
