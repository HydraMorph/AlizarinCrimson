'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client, $mdToast, User) {

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

    $scope.$watch(User.getData, function(newArticle) {
      console.log('getData: ', newArticle);
      if (newArticle && newArticle.error) {
        $mdToast.show(
          $mdToast.simple()
            .content(newArticle.error)
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      } else if (newArticle && newArticle.user) {
        if ($scope.user.remember === true) {
          localStorage.setItem('username', $scope.user.name);
          localStorage.setItem('password', md5.createHash($scope.user.password));
        }
        $mdToast.show(
          $mdToast.simple()
            .content('Welcome, ' + newArticle.user.n)
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
        $mdDialog.hide();
      }
    });

    /* ng-click or ng-enter */
    $scope.login = function () {
      if ($scope.user.name === '') {
        User.login('DonSinDRom', md5.createHash('3a12a6'));
      } else {
        User.login($scope.user.name, md5.createHash($scope.user.password));
      }
    };

    $scope.recoverPassword = function() {
    };

    /* Hide modal */
    $scope.hide = function() {
      $mdDialog.hide();
    };

  });
