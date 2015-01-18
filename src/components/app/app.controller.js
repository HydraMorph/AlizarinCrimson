'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $log, ngSocket, socket) {
    var socket = ngSocket('http://trigger.fm');
    socket.send({foo: 'bar'});
    Client.prototype.init = function(host) {
      console.log('init');
     // this.socket = io.connect(host, {resource: 'socket.io'});
      this.socket=io('http://trigger.fm');
      var socket=this.socket;
      var cl = this;

      socket.on('welcome', function(data) {
          $(cl).trigger('welcome', data);
      });
      function processLogin(data) {
          console.log('process login', data);
      //    var ch = 1;
      //    client.goChannel(1, onChannel);
      }

      client = new Client();
      console.log(client);
      $(client).bind('welcome', function(event, data) {
        console.log('welcome');
        if (data) {
          var user = 'true';
          var pass = MD5("azaza123");
          client.login(user, pass, processLogin);
          console.log('user ' + user);
      //    if (user) {
      //      if (pass) {
      //      } else {
      //        client.goChannel(1, onChannel);
      //      }
      //    } else {
      //      client.goChannel(1, onChannel);
      //    }
        }
      });
      client.init(location.host);
    }
    console.log('init');
    function Client(host) {
      this.version = 2205;
      this.user = null;
      this.channel = {}
      this.callbacks = {};
      this.chat = null;
      this.trackscache = [];
    };
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
