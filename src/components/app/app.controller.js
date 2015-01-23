'use strict';

angular.module('trigger')
  .controller('AppCtrl', ['$scope', 'socket', function ($scope, $timeout, $mdSidenav, $log, socket) {
    function Client(host) {
        this.version = 2205;
        this.user = null;
        this.channel = {}
        this.callbacks = {};
        this.chat = null;
        this.trackscache = [];
    }
    Client.prototype.init = function(host) {
      console.log('init');
      var cl = this;
      $scope.$on('socket:welcome', function (ev, data) {
        console.log(data);
        $scope.theData = data;
      });
//      $scope.on('socket:getver', function() {
//        socket.emit('ver', {'v': cl.version, 'init': true});
//      });
    }
//    function processLogin(data) {
//      console.log('process login', data);
    //  var ch = 1;
    //  client.goChannel(1, onChannel);
//    }
    var client = new Client();
    console.log(client);
//    $(client).bind('welcome', function(event, data) {
//      console.log('welcome');
//      if (data) {
//        var user = 'N';
//        var pass = "84715058abd431959d5dc3d6b19f8f97";
//        client.login(user, pass, processLogin);
//        console.log('user ' + user);
//      }
//    });
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
  }])
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
