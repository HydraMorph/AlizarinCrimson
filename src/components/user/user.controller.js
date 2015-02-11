/*
* TODO
* 1. Caching profile
* 2. Added vote function
* 3. User img checking and default picture setting
* 4. Regdate i18n
* 5. showProfile(id) function
*/


'use strict';

angular.module('trigger')
  .controller('UserCtrl', function ($scope, $rootScope, Client) {
    $scope.user = {};
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed == true) {
        Client.getUser({id: $rootScope.userId},function(data){
          data.karma = data.p.length - data.n.length;
          $scope.user = data;
          console.log(data);
          $scope.$apply();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
  });
