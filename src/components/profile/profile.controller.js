'use strict';

angular.module('trigger')
  .controller('ProfileCtrl', function ($scope) {

    /* init */
    $scope.data = {
      selectedIndex : 0,
      secondLocked : true,
      secondLabel : 'Item Two'
    };

    /* Under development */
    $scope.isMyProfile = false;
//    $scope.$watch(function() {
//      return $rootScope.userId;
//    }, function() {
//      if ($rootScope.userId === Client.user.id) {
//        $scope.isMyProfile = true;
//      }
//    }, true);

    /* md-tabs switcher */
    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };

  });
