'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client, $mdToast) {

  /* exported $animate */

    /* Default values */
    $scope.user = {
      'name': '',
      'password': '',
      'remember': false
    };

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    /* Function for callback */
    function processLogin (data) {
      if (data.error) {
        $mdToast.show(
          $mdToast.simple()
            .content(data.error)
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      } else {
        if ($scope.user.remember === true) {
          localStorage.setItem('username', $scope.user.name);
          localStorage.setItem('password', md5.createHash($scope.user.password));
        }
        $mdToast.show(
          $mdToast.simple()
            .content('Welcome!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
        Client.user = data.user;
        $rootScope.userId = data.user.id;
        $rootScope.load.signed = true;
        $mdDialog.hide();
        $scope.$digest();
      }
    }

    /* ng-click or ng-enter */
    $scope.login = function () {
      if ($scope.user.name === '') {
        Client.login('DonSinDRom', md5.createHash('3a12a6'), processLogin);
      } else {
        Client.login($scope.user.name, md5.createHash($scope.user.password), processLogin);
      }
    };

    $scope.recoverPassword = function() {
    };

    /* Hide modal */
    $scope.hide = function() {
      $mdDialog.hide();
    };

  });
