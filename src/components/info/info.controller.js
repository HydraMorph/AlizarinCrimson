'use strict';

angular.module('trigger')
  .controller('InfoCtrl', function ($scope) {
    $scope.data = {
      selectedIndex : 4,
      secondLocked : true,
      secondLabel : 'Item Two'
    };

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

  });
