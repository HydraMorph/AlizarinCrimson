'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, hotkeys, Client, ngAudio, User) {

    $scope.sound = ngAudio.load('http://trigger.fm/stream/mainmp3');

    $scope.play = false;
    $scope.volume = 50;

    $scope.start = function() {
      $scope.play = true;
      $scope.sound.play();
    };

    /* Autoplay if it was defined in localStorage settings */
    if (localStorage.getItem('play') === 'true') {
      $timeout(function() {
        $scope.start();
      }, 5000);
    }

    var u = localStorage.getItem('username');
    var p = localStorage.getItem('password');
    if (localStorage.getItem('password') !== '') {
      $timeout(function() {
        User.login(u, p);
      }, 5000);
    }

    $scope.togglePlay = function() {
      $scope.play = !$scope.play;
      if ($scope.play === true) {
        localStorage.setItem('play', true);
        $scope.sound.play();
      } else {
        localStorage.setItem('play', false);
        $scope.sound.pause();
      }
    };

    if (localStorage.getItem('volume') && localStorage.getItem('volume').length > -1) {
      $scope.volume = localStorage.getItem('volume');
    } else {
      localStorage.setItem('volume', $scope.volume);
    }

    /* ng-change on slider */
    $scope.changeVolume = function(volume) {
      localStorage.setItem('volume', volume);
      $scope.sound.volume = volume/100; /* audio volume must be >1 and < 0 */
    };

    hotkeys.bindTo($scope)
    .add({
      combo: 'shift+space',
      description: 'Mute current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.togglePlay();
        event.preventDefault();
      }
    })
    ;

    /* Add track to chat */
    $scope.trackToChat = function(trackId) {
      var chatInput = document.querySelector('#chatInput');
      if(chatInput) {
        chatInput.value += '/track' + trackId + ' ';
        chatInput.focus();
      }
    };


    /* Show Democracy tab on default */
    $scope.infoTab = 2;

    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        $scope.infoTab = 0;
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.$watchCollection('infoTab', function(newValue, oldValue){
      if (oldValue === 3 && newValue !== 3) {
        $rootScope.userId = Client.user.id;
        $scope.isMe = true;
        $scope.profileTab = 0;
      }
    });


    $scope.isMe = true;
    /* Under developmant - drafted function for opening user profile */
    $scope.openProfile = function(id) {
      $mdSidenav('right').open(); /* For mobile */
      $scope.swiped = false;
      $rootScope.userId = id;
      if (id === Client.user.id) {
        $scope.isMe = true;
      } else {
        $scope.isMe = false;
      }
      $scope.infoTab = 3;
      $scope.profileTab = 0;
    };

    $scope.setInfoTab = function(id) {
      $scope.infoTab = id;
    };

      /* initProfile */
    $scope.profileTab = 0;
    /* md-tabs switcher */
    $scope.setProfileTab = function(id) {
      $scope.profileTab = id;
    };
    $scope.next = function() {
      $scope.profileTab = Math.min($scope.profileTab + 1, 2) ;
    };
    $scope.previous = function() {
      $scope.profileTab = Math.max($scope.profileTab - 1, 0);
    };

    /* Log out, delete 'username' and 'password' from localStorage */
    $scope.logout = function() {
      Client.logout(
        function() {
          if (localStorage.getItem('password') !== '') {
            localStorage.removeItem('password');
            localStorage.removeItem('username');
          }
        }
      );
      $rootScope.load.signed = false;
      $scope.infoTab = 2;
    };

    $scope.swiped = false;
    $scope.swipe = function () {
      if($scope.swiped === true) {
        $scope.swiped = false;
      } else {
        $scope.swiped = true;
      }
    };
    /* Console panel */
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    /* Info panel (Democracy, profile, history and chat) */
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };
  })
  /* Console panel Ctrl*/
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })
  /* Info panel Ctrl*/
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };

  });
