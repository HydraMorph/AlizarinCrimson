'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $interval, $timeout, $mdDialog, $mdBottomSheet, Client, socket, hotkeys, $translate) {

    /* Default values */
    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.user = {
      'name': '%username%',
      'uplim': 0
    };


    /* Show listeners and active users count */
    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome === true) {
        $scope.users.listeners = Client.channel.lst;
        $scope.users.active = Client.channel.a;
        socket.on('lst', function(data) {
          $scope.users.listeners = data.l;
          $scope.users.active = data.a;
        });
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

    /* Show user's upload limit (after signing)*/
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
//        console.log('Client.user', Client.user);
        $scope.user.name = Client.user.n;
        $scope.user.uplim = Client.user.t;
        socket.on('uplim', function(data) {
          $scope.user.uplim = data.t;
        });
        if (localStorage.getItem('theme') !== undefined && localStorage.getItem('theme').length > 0) {
          document.body.setAttribute('theme', localStorage.getItem('theme'));
        }
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    /* Just for debug. u can delete it */
    $scope.data = function() {
      if (document.body.style.webkitTransform === 'rotateY(180deg)') {
        document.body.style.webkitTransform = 'rotateY(0deg)';
      } else {
        document.body.style.webkitTransform = 'rotateY(180deg)';
      }
      console.log('data', Client);
    };

    $scope.changeTheme = function () {
      var theme = document.body.getAttribute('theme');
      if (theme === 'dark') {
        document.body.setAttribute('theme', 'light');
        if ($scope.load.signed === true) {
          localStorage.setItem('theme', 'light');
        }
      } else {
        document.body.setAttribute('theme', 'dark');
        if ($scope.load.signed === true) {
          localStorage.setItem('theme', 'dark');
        }
      }
    };

    /* Show login modal */
    $scope.showLoginModal = function(ev) {
      $mdDialog.show({
        controller: LoginCtrl,
        templateUrl: 'components/login/login.html',
        targetEvent: ev,
      });
    };

    /* Login modal Ctrl */
    function LoginCtrl($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
    }

    /* Show Upload bar - bottomSheet */
    $scope.openUploadBar = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'components/upload/upload.html',
        controller: 'UploadCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
      });
    };

  });
