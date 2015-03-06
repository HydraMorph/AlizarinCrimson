'use strict';

angular.module('trigger')
  .controller('SettingsCtrl', function ($scope, Client) {

    $scope.gender = !Client.user.g;
    $scope.changeGender = function() {
      console.log('$scope.gender', $scope.gender);
      if ($scope.gender == true) {
        Client.user.g = true;
      } else {
        Client.user.g = false;
      }
      Client.updateUserData({ g: !$scope.gender });
    }

  });
