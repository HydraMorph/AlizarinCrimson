'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $interval, $timeout, $mdDialog, $mdBottomSheet, Client, socket, hotkeys, $translate) {

    /* Random greetings */
    /* get the app's lang */
    var greetingsLang = $translate.preferredLanguage();
    var greetings = {
      'ru': [
        'А ты тоже ждешь 80 порт как и я, username?',
        'Тыц-тыц, username, унц-унц, username!',
        'Когда–то инвайт давали за +11, username.',
        'Не бери треки у наркоманов, username!',
        'Не всё то чилл, что уныло, username!',
        'Не весь метал одинаково полезен, username!',
        'Это не баян, это ротация, username'
      ],
      'en': [
        'Let\'s dance, username?',
        'Let\'s do lunch sometime, username',
        'I\'ve been there., username',
        'Do you hear me, username?'
      ],
      'he': [
        'Lol, username'
      ]
    }

    /* Default values */
    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.user = {
      'name': '%username%',
      'uplim': 0
    };
    var audio = document.getElementById('audio');
    $scope.volume = 50;
    if (localStorage.getItem('volume') && localStorage.getItem('volume').length > -1) {
      $scope.volume = localStorage.getItem('volume');
    } else {
      localStorage.setItem('volume', $scope.volume);
    }

    /* ng-change on slider */
    $scope.changeVolume = function(volume) {
      localStorage.setItem('volume', volume);
      audio.volume = volume/100; /* audio volume must be >1 and < 0 */
    };

    hotkeys.bindTo($scope)
    .add({
      combo: 'shift+left',
      description: 'Volume -1',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume <= 1) {
          $scope.changeVolume(0);
          $scope.volume = 0;
        } else {
          $scope.changeVolume($scope.volume - 1);
          $scope.volume -= 1;
        }
        event.preventDefault();
      }
    })
    .add({
      combo: 'shift+right',
      description: 'Volume +1',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume >= 99) {
          $scope.changeVolume(100);
          $scope.volume = 100;
        } else {
          $scope.changeVolume($scope.volume + 1);
          $scope.volume += 1;
        }
        event.preventDefault();
      }
    })
    .add({
      combo: 'alt+left',
      description: 'Volume -5',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume <= 5) {
          $scope.changeVolume(0);
          $scope.volume = 0;
        } else {
          $scope.changeVolume($scope.volume - 5);
          $scope.volume -= 5;
        }
        event.preventDefault();
      }
    })
    .add({
      combo: 'alt+right',
      description: 'Volume +5',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume >= 95) {
          $scope.changeVolume(100);
          $scope.volume = 100;
        } else {
          $scope.changeVolume($scope.volume + 5);
          $scope.volume += 5;
        }
        event.preventDefault();
      }
    })
    ;

    /* Randomize greetings */
    $scope.greeting = greetings[greetingsLang][Math.floor(Math.random() * greetings[greetingsLang].length)].replace('username', $scope.user.name);
    $interval(function(){
      $scope.greeting = greetings[greetingsLang][Math.floor(Math.random() * greetings[greetingsLang].length)].replace('username', $scope.user.name);
    },9000);

    /* Show listeners and active users count */
    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome === true) {
        $scope.users.listeners = Client.channel.lst;
        $scope.users.active = Client.channel.a;
        socket.on('lst', function(data) {
          $scope.users.listeners = data.l;
          $scope.users.active = data.a;
        });
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

    /* Show user's upload limit (after signing)*/
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
//        console.log('Client.user', Client.user);
        $scope.user.name = Client.user.n;
        $scope.user.uplim = Client.user.t;
        socket.on('uplim', function(data) {
          $scope.user.uplim = data.t;
        });
        if (localStorage.getItem('theme') != undefined && localStorage.getItem('theme').length > 0) {
          document.body.setAttribute("theme", localStorage.getItem('theme'));
        }
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    /* Just for debug. u can delete it */
    $scope.data = function() {
      if (document.body.style.webkitTransform == "rotateY(180deg)") {
        document.body.style.webkitTransform = "rotateY(0deg)";
      } else {
        document.body.style.webkitTransform = "rotateY(180deg)";
      }
      console.log('data', Client);
    };

    $scope.changeTheme = function () {
      var theme = document.body.getAttribute("theme");
      if (theme === 'dark') {
        document.body.setAttribute("theme", "light");
        if ($scope.load.signed === true) {
          localStorage.setItem('theme', 'light');
        }
      } else {
        document.body.setAttribute("theme", "dark");
        if ($scope.load.signed === true) {
          localStorage.setItem('theme', 'dark');
        }
      }
    }

    /* Show login modal */
    $scope.showLoginModal = function(ev) {
      $mdDialog.show({
        controller: LoginCtrl,
        templateUrl: 'components/login/login.html',
        targetEvent: ev,
      });
    };

    /* Login modal Ctrl */
    function LoginCtrl($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
    }

    /* Show Upload bar - bottomSheet */
    $scope.openUploadBar = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'components/upload/upload.html',
        controller: 'UploadCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
      });
    };

  });
