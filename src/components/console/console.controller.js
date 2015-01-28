'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $timeout, $mdDialog, $mdBottomSheet, Client) {
    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.user = {
      'name': '%username%',
      'uplim': 0
    };

    $scope.$watch(function() {
      return $rootScope.welcome;
    }, function() {
      if ($rootScope.welcome == true) {
        $(Client).bind('updatelimits', function(event, data) {
          $scope.user.uplim = data.t;
        });
      }
      $scope.welcome = $rootScope.welcome;
    }, true);

    $scope.$watch(function() {
      return $rootScope.isSigned;
    }, function() {
      if ($rootScope.isSigned == true) {
        $scope.user.name = Client.user.n;
        $scope.user.uplim = Client.user.t;
        $(Client).bind('updatelimits', function(event, data) {
          $scope.user.uplim = data.t;
        });
      }
      $scope.isSigned = $rootScope.isSigned;
    }, true);

    $scope.data = function() {
      console.log(Client);
    }

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
