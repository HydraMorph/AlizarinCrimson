/* Democracy will be replaced */
'use strict';

angular.module('trigger')
  .controller('DemocracyCtrl', function ($scope, Channel) {
    $scope.data = {
      selectedIndex : 1
    };

    $scope.description = '';

    $scope.$watch(Channel.getDescription, function(value) {
      $scope.description = value;
    });

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });
