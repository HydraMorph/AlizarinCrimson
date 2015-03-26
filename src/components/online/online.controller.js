'use strict';

angular.module('trigger')
  .controller('OnlineCtrl', function ($scope, $rootScope, socket, Client, Channel) {

    /* Init */
    $scope.users = [];
    $scope.$watch(Channel.getUsers, function(newArticle, oldArticle, scope) {
      console.log('Online: ', newArticle);
      scope.users = newArticle;
    });

    /* Socket - delete user */
    socket.on('offuser', function(data) {
      $scope.usersCount = $scope.usersCount - 1;
      for (var us in $scope.users) {
        if ($scope.users[us].id === data.uid) {
          $scope.users.splice(us, 1);
        }
      }
    });

    /* Socket - add new user */
    socket.on('newuser', function(data) {
      $scope.usersCount = $scope.usersCount + 1;
      var user = {
        id: data.uid,
        n: data.n,
        a: data.a
      };
      $scope.users.push(user);
    });

    /* Update user status - online and active (gray or yellow color)*/
    socket.on('usupd', function(data) {
      for (var us in $scope.users) {
        if ($scope.users[us].id === data.uid) {
          $scope.users[us].a = data.a;
        }
      }
    });

  });
