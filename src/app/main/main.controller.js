'use strict';

angular.module('trigger')
  .controller('MainCtrl', function ($scope) {})
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, socket) {
    socket.on('welcome', function(data) {
      $scope.name = data.name;
      $scope.users = data.users;
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



