'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $timeout, $mdDialog, $mdBottomSheet, Client) {
    Client.init(location.host);
    console.log(Client);
    $scope.$watch(function() {
      return $rootScope.isSigned;
    }, function() {
      $scope.hideLoginBtn = $rootScope.isSigned;
    }, true);
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
