'use strict';

angular.module('trigger')
  .controller('OnlineCtrl', function ($scope, $rootScope, socket, Client) {

    $scope.users = [];

    socket.on('offuser', function(data) {
      $scope.usersCount = $scope.usersCount - 1;
      for (var us in $scope.users) {
        if ($scope.users[us].id === data.uid) {
          $scope.users.splice(us, 1);
        }
      }
    });

    socket.on('newuser', function(data) {
      $scope.usersCount = $scope.usersCount + 1;
      var user = {
        id: data.uid,
        n: data.n,
        a: data.a
      };
      $scope.users.push(user);
    });

    socket.on('usupd', function(data) {
      for (var us in $scope.users) {
        if ($scope.users[us].id === data.uid) {
          $scope.users[us].a = data.a;
        }
      }
    });


    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome === true) {
        $scope.users = Client.channel.users;
        $scope.usersCount = $scope.users.length;
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

    $scope.openProfile = function(id) {
      $rootScope.userId = id;
    };

  });
