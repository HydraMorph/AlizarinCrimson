//'use strict';
//
//angular.module('trigger')
//  .controller('ProfileCtrl', function ($scope, $rootScope, Client) {
//
//
//    /* Under development */
//    $scope.isMyProfile = true;
//    $scope.$watch(function() {
//      return $rootScope.load.signed;
//    }, function() {
//      if ($rootScope.load.signed === true) {
//        $scope.$watch(function() {
//          return $rootScope.userId;
//        }, function() {
//          if ($rootScope.userId === Client.user.id) {
//            $scope.isMyProfile = true;
//          }
//        }, true);
//      }
//    }, true);
//
//  });
