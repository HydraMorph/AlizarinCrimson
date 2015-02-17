'use strict';

angular.module('trigger')
  .controller('ChatCtrl', function ($scope, $rootScope, Client) {
    $scope.message = '';
    $scope.messages = [];
    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed == true) {
        Client.getChat({}, function(d) {
          $scope.messages = d.m;
          $scope.$digest();
        });
        $(Client).bind('message', function (event, data) {
          console.log(data.m);
          $scope.messages.push(data);
//          console.log(data);
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
    $scope.sendMessage = function () {
      Client.sendMessage($scope.message, function (data) {
        $scope.messages.push(data);
        $scope.$digest();
        if (data.error) {
          //          $('#messageinput').attr("placeholder", data.error);
          console.log(data.error);
        } else {
          console.log(data);
          //          $('#messageinput').attr("placeholder", "РЅР°С‡РёРЅР°Р№ РІРІРѕРґРёС‚СЊ...");
        }
      });
      var res = $scope.message.split(" ");
      var chatters = [];
      for (var i = 0; i < res.length; i++) {
        if (res[i].indexOf('>') > -1) {
          chatters.push(res[i]);
        }
      }
      $scope.message = chatters.join(' ') + ' ';
    };
    $scope.addNick = function(nick) {
      var s = $scope.message;
      if (s.indexOf('>' +  nick) > -1) {
        if (s.indexOf('>>' +  nick) > -1) {
          s = $scope.message.replace('>>' + nick + ' ', '>' + nick + ' ');
        } else {
          s = $scope.message.replace('>' + nick + ' ', '>>' + nick + ' ');
        }
      } else {
        s = '>' + nick + ' ' + $scope.message;
      }
      $scope.message = s;
    }
  });
