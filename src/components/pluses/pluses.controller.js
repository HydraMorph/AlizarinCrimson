/*
* TODO:
* 1. Add caching
* 2. Date i18n
* 3. Infinity scroll
*/

'use strict';

angular.module('trigger')
  .controller('PlusesCtrl', function ($scope, $rootScope, Client) {

    $scope.tracks = [];
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        Client.getUser({'id': $rootScope.userId, 'uplshift': 0, 'p': true}, function(data) {
          $scope.tracks = data;
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
  });
