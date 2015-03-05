'use strict';

angular.module('trigger')
  .controller('ProfileCtrl', function ($scope) {

    /* init */
    $scope.info = { selectedIndex : 0 };

    /* Under development */
    $scope.isMyProfile = true;
//    $scope.$watch(function() {
//      return $rootScope.userId;
//    }, function() {
//      if ($rootScope.userId === Client.user.id) {
//        $scope.isMyProfile = true;
//      }
//    }, true);
    $scope.$watch(function() {
      return $scope.info.selectedIndex;
    }, function() {
      console.log('$scope.info.selectedIndex', $scope.info.selectedIndex);
    }, true);

    /* md-tabs switcher */
    $scope.next = function() {
      $scope.info.selectedIndex = Math.min($scope.info.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.info.selectedIndex = Math.max($scope.info.selectedIndex - 1, 0);
    };

  });
