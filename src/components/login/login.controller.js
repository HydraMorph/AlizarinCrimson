'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client) {
    function processLogin (data) {
      console.log('process login', data);
      if (data.error) {
        console.log(data.error);
      } else {
        Client.user = data.user;
        $rootScope.isSigned = true;
        $mdDialog.hide();
      }
    };
    $scope.user = {
      'name': '',
      'password': ''
    };
    $scope.login = function () {
      Client.login($scope.user.name, md5.createHash($scope.user.password), processLogin);
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
  });
