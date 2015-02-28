/*
* TODO:
* 1. Add caching
* 2. Date i18n
* 3. Infinity scroll
*/

'use strict';

angular.module('trigger')
  .controller('MinusesCtrl', function ($scope, $rootScope, Client) {

    /* init */
    $scope.tracks = [];

    /* Get tracks after signing */
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        Client.getUser({'id': $rootScope.userId, 'uplshift': 0, 'p': false}, function(data) {
          $scope.tracks = data;
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

  });
