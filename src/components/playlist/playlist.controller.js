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
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client, socket) {
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
    socket.on('channeldata', function (data) {
//      if ($rootScope.load.playlist == false) {
        console.log('playlist', data.pls);
        $scope.playlist = data.pls;
//        $rootScope.load.playlist = true;
//      }
    });

//    $scope.$watch(function() {
//        return $rootScope.load.playlist;
//      }, function() {
//        if ($rootScope.load.playlist == true) {
//          $scope.playlist = Client.channel.pls;
//          console.log('Client.channel.pls', Client.channel);
//          console.log('playliiist', Client.channel.pls);
//        }
//        $scope.load.playlist = $rootScope.load.playlist;
//      }, true);

//    socket.on('uptr', function(data) {
//      if (data.t.id == cl.channel.current.id) {
//        var src = cl.channel.current.src;
//        cl.channel.current = data.t;
//        cl.channel.current.scr = src;
//        var track = cl.channel.current;
//        track.vote = 0;
//        for (var v in track.n) {
//          if (track.n[v].vid == cl.user.id) {
//            track.vote = track.n[v].v;
//            break;
//          }
//        }
//        for (var v in track.p) {
//          if (track.p[v].vid == cl.user.id) {
//            track.vote = track.p[v].v;
//            break;
//          }
//        }
//        data.current = true;
//      } else {
//        for (var t in cl.channel.pls) {
//          if (cl.channel.pls[t].id == data.t.id) {
//            cl.channel.pls[t] = data.t;
//            var track = cl.channel.pls[t];
//            track.vote = 0;
//            for (var v in track.n) {
//              if (track.n[v].vid == cl.user.id) {
//                track.vote = track.n[v].v;
//                break;
//              }
//            }
//            for (var v in track.p) {
//              if (track.p[v].vid == cl.user.id) {
//                track.vote = track.p[v].v;
//                break;
//              }
//            }
//            cl.channel.pls.sort(sortFunction);
//            data.current = false;
//            break;
//          }
//        }
//      }
//      $(cl).trigger('trackupdate', data);
//    });
    $(Client).bind('trackupdate', function(event, data) {
      console.log('trackupdate', data.t);
      var plLength = $scope.playlist.length;
      var id;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id == data.t.id) {
          id = i;
          $scope.playlist[i] = data.t;
          console.log($scope.playlist[i]);
          break;
        }
      }
      if (data.current) {
        data.t.current = true;
      }
    });
    $(Client).bind('addtrack', function(event, data) {
      var plLength = $scope.playlist.length;
      var isClone = false;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id == data.track.id) {
          isClone = true;
          console.log($scope.playlist[i]);
          break;
        }
      }
      if (isClone == false) {
        $scope.playlist.push(data.track);
      }
      console.log('addtrack', data.track);
    });
    $(Client).bind('removetrack', function(event, data) {
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id == data.track.id) {
          console.log('removetrack', data.track.id);
          $scope.users.splice(i, 1);
          break;
        }
      }
    });
//
    $scope.voteUp = function(id) {
      console.log(Client);
      Client.addvote({'id': id, 'v': Client.user.w});
    };
    $scope.voteDown = function(id) {
      Client.addvote({'id': id, 'v': Client.user.w});
    };
  });
