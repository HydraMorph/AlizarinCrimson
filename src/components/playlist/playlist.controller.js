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

    $scope.data = function(data) {
      console.log(data);
    }

    $scope.load.signed = false;

    $scope.playlist = [];
    $scope.current = {};
    socket.on('channeldata', function (data) {
      console.log('playlist', data.pls);
      $scope.playlist = data.pls;
      $scope.current = data.current;
      var plsL = data.pls.length;
      for (var i = 0; i < plsL; i++) {
        $scope.playlist[i].vote = 0;
      }
    });

    function checkVotes() {
      var plsL = $scope.playlist.length;
      var pls = [];
      for (var i = 0; i < plsL; i++) {
        for (var vr in $scope.playlist[i].p) {
          if ($scope.playlist[i].p[vr].vid == Client.user.id) {
            $scope.playlist[i].vote = 1;
            break;
          }
        }
        for (var vr in $scope.playlist[i].n) {
          if ($scope.playlist[i].n[vr].vid == Client.user.id) {
            $scope.playlist[i].vote = -1;
            break;
          }
        }
      }
    }

    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed == true) {
        checkVotes();
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome == true) {
        $scope.current = Client.channel.current;
      }
    }, true);

    $(Client).bind('newcurrent', function(event, data) {
      Client.channel.current = data.track;
      if ($scope.load.signed == true) {
        for (var vr in data.track.p) {
          if (data.track.p[vr].vid == Client.user.id) {
            data.track.vote = Client.user.w;
            break;
          }
        }
        for (var vr in data.track.n) {
          if (data.track.n[vr].vid == Client.user.id) {
            data.track.vote = -1*Client.user.w;
            break;
          }
        }
      } else {
        data.track.vote = 0;
      }
      $scope.current = data.track;
      console.log('newcurrent', data);
    });

    $(Client).bind('trackupdate', function(event, data) {
      console.log('trackupdate', data);
      if (data.t.id == Client.channel.current.id) {
        if ($scope.load.signed == true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid == Client.user.id) {
              data.t.vote = Client.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid == Client.user.id) {
              data.t.vote = -1*Client.user.w;
              break;
            }
          }
        }
        $scope.current = data.t;
        console.log('currentUpdate', data.t);
      } else {
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
        if ($scope.load.signed == true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid == Client.user.id) {
              data.t.vote = Client.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid == Client.user.id) {
              data.t.vote = -1*Client.user.w;
              break;
            }
          }
        }
      }
      console.log('trackupdate', data.t);
//      if (data.current) {
//        data.t.current = true;
//      }
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
        for (var vr in data.track.p) {
          if (data.track.p[vr].vid == Client.user.id) {
            console.log('voted+', data.track.p[vr]);
            break;
          }
        }
        for (var vr in data.track.n) {
          if (data.track.n[vr].vid == Client.user.id) {
            console.log('voted-', data.track.p[vr]);
            break;
          }
        }
        $scope.playlist.push(data.track);
      }
      console.log('addtrack', data.track);
    });

    $(Client).bind('removetrack', function(event, data) {
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id == data.track.id) {
          console.log('removetrack', i, data.track.id);
          $scope.playlist.splice(i, 1);
          break;
        }
      }
    });
//
    $scope.voteUp = function(id, type) {
      type = (typeof type === "undefined") ? "track" : type;
      if (type == "current") {
        console.log('current');
        if (this.current.vote == Client.user.w) {
          Client.addvote({'id': id, 'v': 0});
        } else {
          Client.addvote({'id': id, 'v': Client.user.w});
        }
      } else {
        if (this.track.vote == Client.user.w) {
          Client.addvote({'id': id, 'v': 0});
        } else {
          Client.addvote({'id': id, 'v': Client.user.w});
        }
      }
    };

    $scope.voteDown = function(id) {
      if (this.track.vote == -Client.user.w) {
        Client.addvote({'id': id, 'v': 0});
      } else {
        Client.addvote({'id': id, 'v': -Client.user.w});
      }
    };
  });
