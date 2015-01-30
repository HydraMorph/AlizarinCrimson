'use strict';

angular.module('trigger')
  .filter('readableTime', function() {
    return function (seconds) {
      var seconds = parseInt(seconds, 10);
      var hrs, mins, secs;
      switch (false) {
        case !(seconds < 60):
          secs = seconds;
          break;
        case !(seconds < 3600):
          // Minutes and seconds
          mins = ~~(seconds / 60);
          secs = seconds % 60;
          break;
        default:
          // Hours, minutes and seconds
          hrs = ~~(seconds / 3600);
          mins = ~~((seconds % 3600) / 60);
          secs = seconds % 60;
      }
      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = '';
      if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
      }
      if (mins > 0) {
        ret += '' + mins + ':' + (secs < 10 ? '0' : '');
      } else {
        ret += '0:';
      }
      ret += '' + secs;
      return ret;
    };
  })
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client) {
    $scope.reverse = false;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width >= 960) {
      $scope.reverse = true;
    }
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };

//    function fillchannelsdata(d) {
//      console.log('fillchannelsdataPlaylist',d);
//    }
//    Client.getChannels(fillchannelsdata);
//    console.log(Client.getChannels(fillchannelsdata));

    $scope.playlist = [];
//    $scope.$watch(function() {
//        return $rootScope.load.playlist;
//      }, function() {
//        if ($rootScope.load.playlist == true) {
//          $scope.playlist = Client.channel.pls;
//          console.log('playliiist', Client.channel.pls);
//        }
//        $scope.load.playlist = $rootScope.load.playlist;
//      }, true);

    $scope.voteUp = function(id) {
      client.addvote({'id': id, 'v': client.user.w});
    };
    $scope.voteDown = function(id) {
      client.addvote({'id': id, 'v': client.user.w});
    };
  });
