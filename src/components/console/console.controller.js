'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $interval, $timeout, $mdDialog, $mdBottomSheet, Client, socket, Channel, User) {

    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.$watch(Channel.getListeners, function(value) {
      $scope.users.listeners = value;
    });
    $scope.$watch(Channel.getActiveUsers, function(value) {
      $scope.users.active = value;
    });


    $scope.user = {
      'name': '%username%',
      'uplim': 0
    };
    $scope.$watch(User.isAuth, function(value) {
      $scope.load.signed = value;
    });

    $scope.$watch(User.getLimit, function(value) {
      $scope.user.uplim = value;
    });

    $scope.$watch(User.getUsername, function(value) {
      $scope.user.name = value;
    });

    if (localStorage.getItem('theme')) {
      if (localStorage.getItem('theme') !== undefined && localStorage.getItem('theme').length > 0) {
        document.body.setAttribute('theme', localStorage.getItem('theme'));
      }
    }

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
