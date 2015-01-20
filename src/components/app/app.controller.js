'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, socket) {
    $scope.play = true;
    $scope.togglePlay = function() {
      $scope.play = !$scope.play;
    };
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };

    $scope.messages = [];
    $scope.postMessage = function(message) {};
    socket.on('connect', function () {
      $scope.$on('socket:update', function(event, data) {
        $scope.messages.push(data);
      });

      $scope.postMessage = function(message, callback) {
        socket.emit('post', message, function(commitedMessage) {
          $scope.messages.push(commitedMessage);
          callback(commitedMessage);
        });
      };
    });
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
  });
