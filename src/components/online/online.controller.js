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

    console.log('online');

    $scope.users = [];
    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome === true) {
        console.log('Client', Client);
        $scope.users = Client.channel.users;
        $scope.usersCount = $scope.users.length;
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

    $(Client).bind('offuser', function(event, data) {
      console.log('offuser', data);
      $scope.usersCount = $scope.usersCount - 1;
      for (var us in $scope.users) {
        console.log('splice', data.uid);
        if ($scope.users[us].id === data.uid) {
          $scope.users.splice(us, 1);
        }
      }
      $scope.$digest();
    });

    $(Client).bind('newuser', function(event, data) {
      console.log('newuser', data);
      $scope.usersCount = $scope.usersCount + 1;
      var user = {
        id: data.uid,
        n: data.n,
        a: data.a
      };
      $scope.users.push(user);
      $scope.$digest();
    });

    $(Client).bind('userupdate', function(event, data) {
      console.log('userupdate', data);
      for (var us in $scope.users) {
        if ($scope.users[us].id === data.uid) {
          $scope.users[us].a = data.a;
        }
      }
      $scope.$digest();
    });

    $scope.openProfile = function(id) {
      $rootScope.userId = id;
    };

  });
