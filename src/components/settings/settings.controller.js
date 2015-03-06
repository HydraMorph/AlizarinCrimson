'use strict';

angular.module('trigger')
  .controller('SettingsCtrl', function ($scope, Client) {

    $scope.gender = !Client.user.g;
    $scope.changeGender = function() {
      if ($scope.gender == true) {
        Client.user.g = false;
      } else {
        Client.user.g = true;
      }
      Client.updateUserData({ g: !$scope.gender });
    }

  });
