'use strict';

angular.module('trigger')
//  .directive('usersOnline', function(Client) {
//    return {
//      restrict: 'E',
//      templateUrl: '../components/online/_template.html',
//      transclude: true,
//      controller:function($scope, socket) {},
//      link: function($scope, element, Client) {
////        console.log('uo', Client.channel.users);
//      }
//    };
//  })
  .controller('OnlineCtrl', function ($scope, $rootScope, Client) {
//    console.log(Client);
    $scope.users = [];
    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome == true) {
        $scope.users = Client.channel.users;
        $scope.usersCount = Client.channel.users.length;
        console.log('onliiiine', Client);
        $(Client).bind('offuser', function(event, data) {
//          $scope.users = data;
          $scope.usersCount = $scope.usersCount - 1;
          for (var us in $scope.users) {
            if ($scope.users[us].id == data.uid) {
              $scope.users.splice(us, 1);
            }
          }
          console.log('offuser', data);
        });
        $(Client).bind('newuser', function(event, data) {
          $scope.usersCount = $scope.usersCount + 1;
          var user = {
            id: data.uid,
            n: data.n,
            a: data.a
          }
          $scope.users.push(user);
          console.log('newuser', data);
        });
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

//    $scope.loadUsers = function() {
//      console.log('loadUsers', Client);
//      console.log($rootScope.client);
//      $scope.usersCount = $rootScope.client.channel.users.length;
//    }
  });
