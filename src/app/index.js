'use strict';

angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io'])
  .value('nickName', 'true')
  .value('password', '09e7881117ecd5e66723322ef5a6f4e0')
  .factory('socket', function ($rootScope) {
    var socket = io.connect('http://trigger.fm');
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });
