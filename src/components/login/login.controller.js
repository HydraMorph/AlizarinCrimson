'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5) {
    $scope.user = {
      'name': '',
      'password': ''
    };
    console.log($rootScope.client);
    $scope.login = function() {
      console.log(md5.createHash($scope.user.password));
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
