'use strict';

angular.module('trigger')
  .directive('usersOnline', function(Client) {
    return {
      scope: true,
      restrict: 'E',
      templateUrl: '../components/online/_template.html',
      controller:function($scope, socket) {}
    };
  })
  .controller('OnlineCtrl', ['$scope', 'Client', function ($scope, Client) {
    $scope.date = new Date();
    Client.include('Online');
    console.log(Client);
    console.log(Client.channel.users);
    $scope.users = Client.channel.users;
    $scope.usersCount = Client.channel.users.length;
    $(Client).bind('offuser', function(event, data) {
      console.log(data);
    });
    $(Client).bind('newuser', function(event, data) {
      console.log(data);
    });
  }]);
