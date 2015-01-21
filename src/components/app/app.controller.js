'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, socket) {
    function Client(host) {
        this.version = 2205;
        this.user = null;
        this.channel = {}
        this.callbacks = {};
        this.chat = null;
        this.trackscache = [];
    }
    Client.prototype.init = function() {
      console.log('init');
      var cl = this;
      socket.on('welcome', function(data) {
          $(cl).trigger('welcome', data);
      });
      socket.on('getver', function() {
          socket.emit('ver', {'v': cl.version, 'init': true});
      });
    }
    client = new Client();
    console.log(client);
    client.init(location.host);

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
