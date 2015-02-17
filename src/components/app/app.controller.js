'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, socket, Client) {
//    socket.on('channeldata', function (data) {
//      console.log('playlist', data.pls);
//      Client.channel.pls = data.pls;
//      $rootScope.load.playlist = true;
//    });
    var audio = document.getElementById('audio');
    $scope.play = false;
    $scope.togglePlay = function() {
      $scope.play = !$scope.play;
      if ($scope.play == true) {
        audio.play();
      } else {
        audio.pause();
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
