'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, socket, Client, ngAudio) {
//    socket.on('channeldata', function (data) {
//      console.log('playlist', data.pls);
//      Client.channel.pls = data.pls;
//      $rootScope.load.playlist = true;
//    });
    $scope.audio = ngAudio.load('http://trigger.fm/stream/mainmp3');
    console.log($scope.audio);
    $scope.audio.pause();
    $scope.play = $scope.audio.paused;
    $scope.togglePlay = function() {
      $scope.play = !$scope.play;
      if ($scope.audio.paused == true) {
        $scope.audio.play();
      } else {
        $scope.audio.pause();
      };
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
