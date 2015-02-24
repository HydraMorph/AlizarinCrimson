'use strict';

angular.module('trigger')
  .controller('AppCtrl', function ($scope, $rootScope, $timeout, $mdSidenav) {
    var button = document.getElementById('audioBtn');
    var audio = document.getElementById('audio');
    $scope.play = false;
    $scope.togglePlay = function() {
      button.classList.toggle('play');
      $scope.play = !$scope.play;
      if ($scope.play === true) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    $scope.trackToChat = function(trackId) {
      var chatInput = document.querySelector('#chatInput');
      if(chatInput) {
        chatInput.value += '/track' + trackId + ' ';
        chatInput.focus();
      }
    };

    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('left').close();
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav) {
    $scope.close = function () {
      $mdSidenav('right').close();
    };
  });
