'use strict';

angular.module('trigger')
  .directive('usersOnline', function(Client) {
    return {
      restrict: 'E',
      templateUrl: '../components/online/_template.html',
      transclude: true,
      controller:function($scope, socket) {},
      link: function($scope, element, Client) {
//        console.log('uo', Client.channel.users);
      }
    };
  })
  .controller('OnlineCtrl', ['$scope', '$rootScope' , 'Client', function ($scope, $rootScope, Client) {
//    console.log(Client);
    $scope.users = [];
    $scope.$watch(function() {
      return $rootScope.welcome;
    }, function() {
      if ($rootScope.welcome == true) {
        $scope.users = Client.channel.users;
        $scope.usersCount = Client.channel.users.length;
      }
      $scope.welcome = $rootScope.welcome;
    }, true);

//    $scope.loadUsers = function() {
//      console.log('loadUsers', Client);
//      console.log($rootScope.client);
//      $scope.usersCount = $rootScope.client.channel.users.length;
//    }
  }]);
