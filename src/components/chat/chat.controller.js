'use strict';

angular.module('trigger')
  .controller('ChatCtrl', function ($scope, $rootScope, Client) {

    function tink() {
      var sound = new Audio();
      if (sound.canPlayType('audio/ogg')) {
        sound.src = 'http://trigger.fm/sounds/tink.ogg';
        sound.play();
      } else {
        sound.src = 'http://trigger.fm/sounds/tink.mp3';
        sound.play();
      }
    }
    $scope.message = '';
    $scope.messages = [];
    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed == true) {
        Client.getChat({}, function(d) {
          $scope.messages = d.m;
          var mL = d.m.length;
          for (var i = 0; i < mL; i++) {
            if (checkPrivate(d.m[i])) {
              d.m[i].private = true;
              tink();
            }
          }
          $scope.$digest();
        });
        $(Client).bind('message', function (event, data) {
          if (checkPrivate(data)) {
            data.private = true;
            tink();
          }
          $scope.messages.push(data);
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    function checkPrivate(messages) {
      if (messages.m.indexOf(Client.user.n) > -1) {
        return true;
      }
    }
    function focus() {
      document.querySelector('#chatInput input').focus();
    }

    $scope.sendMessage = function () {
      if (this.message) {
        Client.sendMessage($scope.message, function (data) {
          if (data.m) {
            $scope.messages.push(data);
            $scope.$digest();
          }
          if (data.error) {
            console.log(data.error);
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
      }
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
      focus();
    }
  });
