/* Democracy will be replaced */
'use strict';

angular.module('trigger')
  .controller('DemocracyCtrl', function ($scope, $rootScope, Client, Channel, $interval) {
    $scope.data = {
      selectedIndex : 1
    };

    var timer = $interval(function() {
      console.log(Channel);
    }, 10000);
//    $scope.moderators = [];
//    $scope.banned = [];
//    $scope.president = {
//      'name': '',
//      'id': ''
//    };
//
//    $scope.$watch(function() {
//      return $rootScope.load.channel;
//    }, function() {
//      if ($rootScope.load.channel === true) {
//        $scope.president.name = $rootScope.channel.prname;
//        $scope.president.id = $rootScope.channel.prid;
//        $scope.moderators = $rootScope.channel.editors;
//        $scope.banned = $rootScope.channel.banned;
//        console.log($scope.president, $scope.moderators, $scope.banned);
////        console.log('Client.user', Client.user);
//      }
//    }, true);

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });
