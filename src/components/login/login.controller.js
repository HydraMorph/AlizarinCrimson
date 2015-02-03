'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client) {
    function processLogin (data) {
      console.log('process login', data);
      console.log(Client);
      if (data.error) {
        console.log(data.error);
      } else {
        Client.user = data.user;
        $rootScope.load.signed = true;
        $mdDialog.hide();
      }
    };
    $scope.user = {
      'name': '',
      'password': ''
    };
    $scope.login = function () {
//      Client.login($scope.user.name, md5.createHash($scope.user.password), processLogin);
      Client.login('DonSinDRom', md5.createHash('3a12a6'), processLogin);
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
  });
