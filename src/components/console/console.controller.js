'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope) {
    $scope.data = "Console";
    $scope.volume = 23;
    $scope.changeVolume = function(volume) {
      $scope.volume = volume;
    }
  });
