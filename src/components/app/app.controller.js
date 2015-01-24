'use strict';

angular.module('trigger')
  .controller('AppCtrl', ['$scope', 'socket', function ($scope, $rootScope, $timeout, $mdSidenav, $log, md5, socket) {

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
      this.socket = io('http://trigger.fm');
      var socket = this.socket;
      var cl = this;

      socket.on('welcome', function(data) {
        $(cl).trigger('welcome', data);
      });

      socket.on('getver', function() {
        socket.emit('ver', {'v': cl.version, 'init': true});
      });

      socket.on('loginstatus', function(data) {
        if (data.error) {
          var message = '';
          if (data.error == 'nouser') {
            data.error = 'Нет такого пользователя';
          }
          if (data.error == 'wrongpass') {
            data.error = 'Не тот пароль';
          }
        } else {
          cl.user = data.user;
          if (cl.user.t < 0) {
            cl.user.t = 0;
          }
          cl.user.nt = new Date(Date.parse(new Date()) + cl.user.nt);
        }
        cl.callbacks.loginstatus(data);
      });
    }

    Client.prototype.login = function(name, pass, callback) {
      var cl = this;
      cl.callbacks.loginstatus = callback;
      this.socket.emit('login', {u: name, p: pass});
    }
    Client.prototype.updateUserData = function(data) {
      this.socket.emit('upduserdata', data);
    }

    function processLogin(data) {
      console.log('process login', data);
    }

    var client = new Client();
    $rootScope.client = client;
    console.log($rootScope.client);
    $(client).bind('welcome', function(event, data) {
      console.log('welcome');
      if (data) {
        var user = 'true';
        var pass = '09e7881117ecd5e66723322ef5a6f4e0';
        client.login(user, pass, processLogin);
        console.log('user ' + user);
      }
    });
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
