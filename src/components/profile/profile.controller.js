'use strict';

angular.module('trigger')
  .controller('ProfileCtrl', function ($scope, $rootScope, Client) {
    $scope.data = {
      selectedIndex : 0,
      secondLocked : true,
      secondLabel : 'Item Two'
    };
    $scope.isMyProfile = false;
    $scope.$watch(function() {
      return $rootScope.userId;
    }, function() {
      if ($rootScope.userId === Client.user.id) {
        $scope.isMyProfile = true;
      }
    }, true);
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });
