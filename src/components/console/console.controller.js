'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $timeout, $mdDialog, $mdBottomSheet, Client) {
    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.user = {
      'name': '',
      'uplim': 0
    };


    $scope.data = function() {
      console.log(Client);
    }

    Client.init(location.host);
    $(Client).bind('welcome', function(event, data) {
      Client.channel = data.channels[0];
      console.log(data.channels[0]);
    });

    $(Client).bind('listners', function(event, data) {
      $scope.users.listeners = data.l;
      $scope.users.active = data.a;
    });
    console.log(Client);

    $scope.$watch(function() {
      return $rootScope.isSigned;
    }, function() {
      $scope.isSigned = $rootScope.isSigned;
    }, true);

    $(Client).bind('updatelimits', function(event, data) {
      $scope.user.name = Client.user.n;
      $scope.user.uplim = Client.user.t;
    });



    $scope.showLoginModal = function(ev) {
      $mdDialog.show({
        controller: LoginCtrl,
        templateUrl: 'components/login/login.html',
        targetEvent: ev,
      })
    };
    function LoginCtrl($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
    };
    $scope.volume = 23;
    $scope.changeVolume = function(volume) {
      $scope.volume = volume;
    };
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
