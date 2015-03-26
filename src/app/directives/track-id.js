//'use strict';
//
//var app = angular.module('trigger');
//
//app.directive('trackId', ['$rootScope', 'socket', 'Client', function($rootScope, socket, Client) {
//  return {
//    restrict: 'AEC',
//    scope: {
//      class: '@'
//    },
//    link: function(scope, element, attrs) {
//      Client.track(attrs.trackId, function(data) {
//        element.html(data.a + ' - ' + data.t);
//      });
//    }
//  };
//}]);
