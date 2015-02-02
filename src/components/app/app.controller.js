'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, socket, Client) {
//    socket.on('channeldata', function (data) {
//      console.log('playlist', data.pls);
//      Client.channel.pls = data.pls;
//      $rootScope.load.playlist = true;
//    });
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
