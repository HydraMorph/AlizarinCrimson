'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, socket, Client, ngAudio) {
    $scope.audio = ngAudio.load('http://trigger.fm/stream/mainmp3');
    console.log($scope.audio);
    $scope.audio.pause();
    $scope.audio.unbind();
    $scope.play = $scope.audio.paused;
    $scope.togglePlay = function() {
      $scope.play = !$scope.play;
      if ($scope.audio.paused === true) {
        $scope.audio.play();
      } else {
        $scope.audio.pause();
      }
    };
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
  });
