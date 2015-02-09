/*
* TODO:
* 1. Add caching
* 2. Date i18n
* 3. Infinity scroll
*/

'use strict';

angular.module('trigger')
  .controller('UploadsCtrl', function ($scope, $rootScope, Client) {

    $scope.tracks = [];
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed == true) {
        Client.getUser({'id': 1917, 'uplshift': 0}, function(data) {
          $scope.tracks = data;
          console.log(data);
          $scope.$apply();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
  });
