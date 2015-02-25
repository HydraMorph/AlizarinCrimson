'use strict';

angular.module('trigger')
  .controller('ChatCtrl', function ($scope, $rootScope, Client) {

    var customCodes = [];
    customCodes[0] = [];
    customCodes[0][0] = /(http:\/\/[\w\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[\w])+\.(?:jpg|png|gif|jpeg|bmp))/gim;
    customCodes[0][1] = '<a href="$1" target="_blank"><img src="$1" /></a>';

    customCodes[1] = [];
    customCodes[1][0] = /(https:\/\/[\w\-\.]+\.[a-zA-Z]{2,3}(?:\/\S*)?(?:[\w])+\.(?:jpg|png|gif|jpeg|bmp))/gim;
    customCodes[1][1] = '<a href="$1" target="_blank"><img src="$1" /></a>';

    customCodes[2] = [];
    customCodes[2][0] = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    customCodes[2][1] = '<a href="$1" target="_blank">$1</a>';

    customCodes[3] = [];
    customCodes[3][0] = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    customCodes[3][1] = '<a href="http://$1" target="_blank">$1</a>';

    customCodes[4] = [];
    customCodes[4][0] = /([\w\-\d]+\@[\w\-\d]+\.[\w\-\d]+)/gim;
    customCodes[4][1] = '<a href="mailto:$1">$1</a>';

    customCodes[5] = [];
    customCodes[5][0] = '!!!!!!!!!!';
    customCodes[5][1] = 'я идиот убейте меня кто нибудь! !!!!';

    customCodes[6] = [];
    customCodes[6][0] = '))))))))))';
    customCodes[6][1] = '<font color="pink">недавно я познакомился с мальчиком, у него такие голубые глаза и член который еле помещается в мою... кажется я не туда пишу</font> ';

    customCodes[7] = [];
    customCodes[7][0] = 'NO.';
    customCodes[7][1] = '&lt;img src="/assets/images/nocover.png" style="object-fit: contain;"/&gt;';

    function tink() {
      if ($scope.data.tink === true) {
        var sound = new Audio();
        if (sound.canPlayType('audio/ogg')) {
          sound.src = 'http://trigger.fm/sounds/tink.ogg';
          sound.play();
        } else {
          sound.src = 'http://trigger.fm/sounds/tink.mp3';
          sound.play();
        }
      }
    }

    $scope.message = '';
    $scope.messages = [];

    $scope.data = {
      tink: true,
      img: true
    };
    if (localStorage.getItem('tink') === false) {
      $scope.data.tink = false;
    }
    if (localStorage.getItem('img') === false) {
      $scope.data.img = false;
    }
    $scope.setTink = function() {
      if($scope.data.tink === true) {
        localStorage.setItem('tink', true);
      } else {
        localStorage.setItem('tink', false);
      }
    }
    $scope.setImg = function() {
      if($scope.data.img === true) {
        localStorage.setItem('img', true);
      } else {
        localStorage.setItem('img', false);
      }
    }


    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed === true) {
        Client.getChat({}, function(d) {
          var tnk = false;
          var messages = d.m;
          var privateMessages = getPrivateMessages();
          var mChat = mixChat(messages, privateMessages);
          var mL = mChat.length;
          var cL = customCodes.length;
          for (var j = 0; j < mL; j++) {
            for (var i = 0; i < cL; i++) {
              if (mChat[j].m.replace(customCodes[i][0], '') !== mChat[j].m) {
                if (i < 2) {
                  mChat[j].m = mChat[j].m.replace(customCodes[i][0], customCodes[i][1]);
                  break;
                } else {
                  mChat[j].m = mChat[j].m.replace(customCodes[i][0], customCodes[i][1]);
                }
              }
            }


            var type = checkType(mChat[j]);
            if (type) {
              mChat[j].type = type;
              tnk = true;
            }
          }
          if (tnk) {
            tink();
          }
          $scope.messages = mChat;
//          $scope.addTracks();
        });


//        $scope.addTracks = function() {
//          var mL = $scope.messages.length;
//          for (var i = 0; i < mL; i++) {
//            if($scope.messages[i].m.indexOf('/track') > -1) {
//              var meta = /\/track(\w*)/gim;
//              var res = meta.exec($scope.messages[i].m);
//              console.log('res', res);
//              var q = $scope.messages[i].m;
//              Client.track(res[1], function(data) {
//                q = res.input.replace(res[0], data.a + ' - ' + data.t);
//                console.log('q', q);
//              });
//              $scope.messages[i].m = q;
//              console.log('$scope.messages[i].m', $scope.messages[i].m);
//            }
//          }
//        }


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

          var cL = customCodes.length;
          for (var i = 0; i < cL; i++) {
            if (data.m.replace(customCodes[i][0], '') !== data.m) {
              if (i < 2) {
                data.m = data.m.replace(customCodes[i][0], customCodes[i][1]);
                break;
              } else {
                data.m = data.m.replace(customCodes[i][0], customCodes[i][1]);
              }
            }
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
        var res = $scope.message.split(' ');
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
    };
  });
