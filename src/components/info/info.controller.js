//'use strict';
//
//angular.module('trigger')
//  .controller('InfoCtrl', function ($scope, $rootScope) {
//
//    /* Show Democracy tab on default */
//    $scope.infoTab = 2;
//
//    $scope.$watch(function() {
//      return $rootScope.load.signed;
//    }, function() {
//      if ($rootScope.load.signed === true) {
//        $scope.infoTab = 0;
//      }
//      $scope.load.signed = $rootScope.load.signed;
//    }, true);
//
//    $scope.$watch(function() {
//      return $scope.infoTab;
//    }, function() {
//      console.log('$scope.infoTab', $scope.infoTab);
//    }, true);
//
//    $scope.$watchCollection('infoTab', function(newValue, oldValue){
//      console.log('being watched oldValue:', oldValue, 'newValue:', newValue);
//    });
//
//    $scope.next = function() {
//      $scope.infoTab = Math.min($scope.infoTab + 1, 2) ;
//    };
//
//    $scope.previous = function() {
//      $scope.infoTab = Math.max($scope.infoTab - 1, 0);
//    };
//
//  });
