'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, socket) {
    $scope.init = function () {
      $scope.version = 2205;
      $scope.user = null;
      $scope.channel = {}
      $scope.callbacks = {};
      $scope.chat = null;
      $scope.trackscache = [];
    }
    socket.on('welcome', function(data) {
      $(cl).trigger('welcome', data);
      console.log(data);
    });
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
