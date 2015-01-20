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

    socket.on('welcome', function (data) {
      console.log(data);
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
