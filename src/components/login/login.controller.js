'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client) {
    $scope.user = {
      'name': '',
      'password': ''
    };
    $scope.login = function () {
      function processLogin (data) {
        console.log('process login', data);
      }
      Client.login($scope.user.name, md5.createHash($scope.user.password), processLogin);
      console.log(Client);
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  });
