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
          var mL = d.m.length;
//          for (var i = 0; i < mL; i++) {
//            if (checkPrivate(d.m[i])) {
//              d.m[i].private = true;
//              tink();+
//            }
//          }
          var messages = d.m;
          var privateMessages = getPrivateMessages();
          $scope.messages = mixChat(messages, privateMessages);
        });
//        $scope.$digest();

        $(Client).bind('message', function (event, data) {
          var type = checkType(data);
          if (type) {
            data.type = type;
            tink();
            if (data.type === 'private') {
              sessionStorage.setItem('private' + data.t, JSON.stringify(data));
            }
          } else if (data.m.indexOf('&gt;&gt;') > -1) {
            sessionStorage.setItem('private' + data.t, JSON.stringify(data));
          }
          $scope.messages.push(data);
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    function mixChat(messages, privateMessages) {
      var a = messages.concat(privateMessages);
      a = a.sort(function(a, b) {
        return new Date(a.t) - new Date(b.t);
      });
      return a;
    }

    function getPrivateMessages() {
      var sL = sessionStorage.length;
      var list = [];
      for (var i = 0; i < sL; i++) {
        var key = sessionStorage.key(i);
        var value = sessionStorage.getItem(key);
        if (key.indexOf('private') > -1) {
          list.push(JSON.parse(value));
        }
      }
      return list;
    }

    function checkType(msg) {
      if (msg.m.indexOf('&gt;&gt;'+ Client.user.n) > -1) {
        return 'private';
      } else if (msg.m.indexOf('&gt;'+ Client.user.n) > -1) {
        return 'personal';
      } else {
        return undefined;
      }
    }

    function focus() {
      document.querySelector('#chatInput').focus();
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
