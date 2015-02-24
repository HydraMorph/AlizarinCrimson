'use strict';

angular.module('trigger')
  .controller('InfoCtrl', function ($scope, $rootScope) {
    $scope.data = {
      selectedIndex: 3
    };

    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        $scope.data.selectedIndex = 0;
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

  });
