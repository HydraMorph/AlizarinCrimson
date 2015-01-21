'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, ngSocket) {
    $scope.init = function () {
      $scope.version = 2205;
      $scope.user = null;
      $scope.channel = {}
      $scope.callbacks = {};
      $scope.chat = null;
      $scope.trackscache = [];
    }
    var ws = ngSocket('ws://trigger.fm/socket.io/');
    //Can call before socket has opened
    ws.send({foo: 'bar'});
//    socket.on('welcome', function(data) {
//      console.log(data);
//      $(cl).trigger('welcome', data);
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
