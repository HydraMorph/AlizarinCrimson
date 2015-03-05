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

    /* init */
    $scope.user = {};

    /* Get data after signing */
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        Client.getUser({id: $rootScope.userId},function(data){
          data.karma = data.p.length - data.n.length;
          $scope.user = data;
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.$watch(function() {
      return $rootScope.userId;
    }, function() {
      var id = $rootScope.userId;
      if (id === 0) {
        id = '0';
      }
      Client.getUser({id: id},function(data){
        data.karma = data.p.length - data.n.length;
        $scope.user = data;
        $scope.$digest();
      });
    }, true);

  });
