'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client) {

    /* Default values */
    $scope.user = {
      'name': '',
      'password': ''
    };

    /* Function for callback */
    function processLogin (data) {
      if (data.error) {
        console.log(data.error);
      } else {
        localStorage.setItem('username', $scope.user.name);
        localStorage.setItem('password', md5.createHash($scope.user.password));
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

    /* Hide modal */
    $scope.hide = function() {
      $mdDialog.hide();
    };

  });
