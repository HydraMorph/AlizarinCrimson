'use strict';

angular.module('trigger')
  .controller('InfoCtrl', function ($scope, $rootScope) {

    /* Show Democracy tab on default */
    $scope.selectedIndex = 2;

    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        $scope.selectedIndex = 0;
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.next = function() {
      $scope.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

  });
