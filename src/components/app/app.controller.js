'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav, hotkeys, Client) {

    var button = document.getElementById('audioBtn');
    var audio = document.getElementById('audio');
    $scope.play = false;
    $scope.start = function() {
      $scope.play = true;
      button.classList.add('play');
      audio.play();
    }
    /* Autoplay if it was defined in localStorage settings */
    if (localStorage.getItem('play') === 'true') {
      $timeout($scope.start(), 5000);
    }

    $scope.togglePlay = function() {
      button.classList.toggle('play');
      $scope.play = !$scope.play;
      if ($scope.play === true) {
        localStorage.setItem('play', true);
        audio.play();
      } else {
        localStorage.setItem('play', false);
        audio.pause();
      }
    };

    hotkeys.bindTo($scope)
    .add({
      combo: 'ctrl+space',
      description: 'Mute current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        $scope.togglePlay();
        event.preventDefault();
      }
    })
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
      if (oldValue === 3 && newValue != 3) {
        $rootScope.userId = Client.user.id;
        $scope.isMe = true;
        $scope.profileTab = 0;
      }
    });


    $scope.isMe = true;
    /* Under developmant - drafted function for opening user profile */
    $scope.openProfile = function(id) {
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
          if (localStorage.getItem('password') != '') {
            localStorage.removeItem('password');
            localStorage.removeItem('username');
          }
        }
      );
      $rootScope.load.signed = false;
      $scope.infoTab = 2;
    }

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
