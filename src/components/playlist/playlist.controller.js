'use strict';

angular.module('trigger')
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client, socket, $interval, hotkeys, Channel, User) {

    /* init */
    $scope.isAuth = false;
    $scope.playlist = [];
    $scope.track = {};
    $scope.channel = {};
    $scope.channel.name = 'Channel';
    $scope.channel.id = 0;
    $scope.user = {};
    $scope.user.name = '';
    $scope.user.id = 0;
    $scope.user.w = 0;

    $scope.$watch(User.getUsername, function(value) {
      $scope.user.name = value;
    });
    $scope.$watch(User.getUservote, function(value) {
      $scope.user.w = value;
    });

    $scope.$watch(Channel.getId, function(value) {
      $scope.channel.id = value;
    });
    $scope.$watch(Channel.getCurrent, function(value) {
      $scope.track = value;
      $rootScope.title = '+D' + value.a + ' - ' + value.t + ' @ Trigger';
    });

    $scope.$watch(Channel.getPlaylist, function(value) {
      $scope.playlist = value;
    });

    $scope.$watch(User.isAuth, function(value) {
      $scope.isAuth = value;
      if (value === true) {
        checkVotes();
      }
    });

    hotkeys.bindTo($scope)
    .add({
      combo: 'alt+up',
      description: 'Up current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        addVote({ 'id': $scope.track.id, 'v': $scope.user.w });
        event.preventDefault();
        console.log('alt+up');
      }
    })
    .add({
      combo: 'alt+down',
      description: 'Down current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        addVote({ 'id': $scope.track.id, 'v': -1*$scope.user.w });
        event.preventDefault();
        console.log('alt+down');
      }
    })
    ;

    /* Used for track sorting in playlist - setted flex-flow: column-reverse */
    $scope.reverse = 0;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 960) {
      $scope.reverse = 1;
    }

    /* Don't know what is it */
    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };

    /* Socket - new current track - removing it from playlist and and add to current */
    /* jshint shadow:true */
    socket.on('newcurrent', function(data) {
//      console.log('newcurrent', data);
      if ($scope.isAuth === true) {
        for (var vr in data.track.p) {
          if (data.track.p[vr].vid === Client.user.id) {
            data.track.vote = $scope.user.w;
            break;
          }
        }
        for (var vr in data.track.n) {
          if (data.track.n[vr].vid === Client.user.id) {
            data.track.vote = -$scope.user.w;
            break;
          }
        }
      }
      data.track.ut = setTimezone(data.track.ut);
      Client.channel.current = data.track;
      $scope.stopTimer();
      $scope.starTimer(0, data.track.tt);
      $scope.track = data.track;
      $rootScope.title = '! ' + data.track.a + ' - ' + data.track.t + ' @ Trigger';
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.tid || $scope.playlist[i].id === data.track.id) {
          $scope.playlist.splice(i, 1);
          break;
        }
      }
    });

    /* Check votes after signing - for color setting if user voted plus or minus */
    function checkVotes() {
      var plsL = $scope.playlist.length;
      for (var i = 0; i < plsL; i++) {
        for (var vr in $scope.playlist[i].p) {
          if ($scope.playlist[i].p[vr].vid === Client.user.id) {
            $scope.playlist[i].vote = $scope.user.w;
            break;
          }
        }
        for (var vr in $scope.playlist[i].n) {
          if ($scope.playlist[i].n[vr].vid === Client.user.id) {
            $scope.playlist[i].vote = -$scope.user.w;
            break;
          }
        }
      }
      for (var vr in $scope.track.p) {
        if ($scope.track.p[vr].vid === Client.user.id) {
          $scope.track.vote = $scope.user.w;
          break;
        }
      }
      for (var vr in $scope.track.n) {
        if ($scope.track.n[vr].vid === Client.user.id) {
          $scope.track.vote = -$scope.user.w;
          break;
        }
      }
    }

    /* Socket Update track - vote, title or artist */
    socket.on('uptr', function(data) {
      if (data.t.id === $scope.track.id) {
        if ($scope.isAuth === true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid === Client.user.id) {
              data.t.vote = $scope.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid === Client.user.id) {
              data.t.vote = -1 * $scope.user.w;
              break;
            }
          }
        }
        data.t.ut = setTimezone(data.t.ut);
        $scope.track = data.t;
      } else {
        var plLength = $scope.playlist.length;
        var id;
        for (var i = 0; i < plLength; i++) {
          if ($scope.playlist[i].id === data.t.id) {
            id = i;
            data.t.ut = setTimezone(data.t.ut);
            $scope.playlist[i] = data.t;
            break;
          }
        }
        if ($scope.isAuth === true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid === Client.user.id) {
              data.t.vote = $scope.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid === Client.user.id) {
              data.t.vote = -1 * $scope.user.w;
              break;
            }
          }
        }
      }
    });

    /* Socket - add track in playlist */
    socket.on('addtrack', function(data) {
//      console.log('addtrack', data);
      addTrack(data.track);
    });

    function addTrack(track) {
      var track = track;
      track.vote = 0;
      track.src = 'img/nocover.png';
      var plLength = $scope.playlist.length;
      var isClone = false;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === track.id) {
          isClone = true;
          break;
        }
      }
      if (isClone === false) {
        if ($scope.isAuth === true) {
          for (var vr in track.p) {
            if (track.p[vr].vid === Client.user.id) {
              track.vote = $scope.user.w;
              break;
            }
          }
          for (var vr in track.n) {
            if (track.n[vr].vid === Client.user.id) {
              track.vote = -1 * $scope.user.w;
              break;
            }
          }
        }
        track.ut = setTimezone(track.ut);
        $scope.playlist.push(track);
      }
    }

    function setTimezone(obj) {
      var d = new Date(obj);
      return addMinutes(d, $rootScope.timezoneOffset);
    }

    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
    }

    /* Socket - delete track from playlist */
    socket.on('removetrack', function(data) {
//      console.log('removetrack', data);
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.tid) {
          $scope.playlist.splice(i, 1);
          break;
        }
      }
    });

    /* Vote function */
    function addVote (data) {
      data.chid = $scope.channel.id;
      socket.emit('vote', data);
    }

    /* VoteUp. Check screen size - on low-res screens buttons are reversed */
    $scope.voteUp = function (id) {
      var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      var reverse = false;
      if (width <= 960) {
        reverse = true;
      }
      if (reverse === true) {
        if (this.track.vote === -$scope.user.w) {
          addVote({ 'id': id, 'v': 0});
        } else {
          addVote({'id': id, 'v': -$scope.user.w });
        }
      } else {
        if (this.track.vote === $scope.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': $scope.user.w });
        }
      }
    };

    /* VoteDown. Check screen size - on low-res screens buttons are reversed */
    $scope.voteDown = function (id) {
      var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      var reverse = false;
      if (width <= 960) {
        reverse = true;
      }
      if (reverse === true) {
        if (this.track.vote === $scope.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': $scope.user.w });
        }
      } else {
        if (this.track.vote === -$scope.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': -$scope.user.w });
        }
      }
    };

    /* Meter for current track with timer */
    var i = 0;
    var timer;
    $scope.progress = 0;
    $scope.starTimer = function(start, duration) {
      i = start;
      timer = $interval(function() {
        $scope.progress = (i/duration*100).toFixed(2);
        i++;
      }, 1000);
    };
    $scope.stopTimer = function() {
      if (angular.isDefined(timer)) {
        $interval.cancel(timer);
        timer = undefined;
        $scope.progress = 0;
      }
    };

  });
