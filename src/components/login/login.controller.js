'use strict';

angular.module('trigger')
  .controller('LoginCtrl', function ($scope, $rootScope, $mdDialog, md5, Client) {
    $scope.user = {
      'name': '',
      'password': ''
    };
    $(Client).bind('welcome', function(event, data) {
      if (data) {
        showChannels(data);
        var user = "true";
        var pass = md5.createHash('azaza123');
        if (user) {
          if (pass) {
            Client.login(user, pass, processLogin);
          } else {
            Client.goChannel(1, onChannel);
          }
        } else {
          Client.goChannel(1, onChannel);
        }
      }
    });
    $scope.login = function() {
      Client.welcome;
      console.log(Client);
      console.log(md5.createHash($scope.user.password));
    };
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
  });
