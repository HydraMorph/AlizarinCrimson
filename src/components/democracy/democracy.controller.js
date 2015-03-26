/* Democracy will be replaced */
'use strict';

angular.module('trigger')
  .controller('DemocracyCtrl', function ($scope, Channel) {
    $scope.data = {
      selectedIndex : 1
    };

    $scope.description = '';

    $scope.$watch(Channel.getDescription, function(newArticle, oldArticle, scope) {
      console.log('Description: ', newArticle);
      scope.description = newArticle;
    });

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });
