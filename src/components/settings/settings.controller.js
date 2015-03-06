'use strict';

angular.module('trigger')
  .controller('SettingsCtrl', function ($scope, Client, md5, $mdToast, $animate) {

    $scope.gender = !Client.user.g;
    $scope.changeGender = function() {
      if ($scope.gender == true) {
        Client.user.g = false;
      } else {
        Client.user.g = true;
      }
      Client.updateUserData({ g: !$scope.gender });
    }

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

    $scope.oldPassword = '';
    $scope.newPassword = '';
    $scope.newPasswordFix = '';
    $scope.changePassword = function() {
      if ($scope.newPassword.length > 0 && $scope.newPassword === $scope.newPasswordFix) {
        var oldPassword = md5.createHash($scope.oldPassword);
        var newPassword = md5.createHash($scope.newPassword);
        Client.changepass(oldPassword, newPassword, function(data) {
          console.log(data);
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .content('Все получилось!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          } else {
            $mdToast.show(
              $mdToast.simple()
                .content('Что-то пошло не так!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          }
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .content('Пароли не совпадают!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      }
    }

  });
