'use strict';

angular.module('trigger')
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client, socket, $interval, hotkeys) {

    /* init */
    $scope.load.signed = false;
    $scope.playlist = [];
    $scope.track = {};
    $scope.channel = 'Channel';

    hotkeys.bindTo($scope)
    .add({
      combo: 'alt+up',
      description: 'Up current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        addVote({ 'id': $scope.track.id, 'v': Client.user.w });
        event.preventDefault();
        console.log('alt+up');
      }
    })
    .add({
      combo: 'alt+down',
      description: 'Down current track',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        addVote({ 'id': $scope.track.id, 'v': -1*Client.user.w });
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


    /* Get gisrt data - current track*/
    $scope.$watch(function () {
      return $rootScope.load.welcome;
    }, function () {
      if ($rootScope.load.welcome === true) {
        Client.channel.current.ut = setTimezone(Client.channel.current.ut);
        $scope.track = Client.channel.current;
        $rootScope.title = '+D' + Client.channel.current.a + ' - ' + Client.channel.current.t + ' @ Trigger';
      }
    }, true);

    /* Socket - new current track - removing it from playlist and and add to current */
    /* jshint shadow:true */
    socket.on('newcurrent', function(data) {
//      console.log('newcurrent', data);
      if ($scope.load.signed === true) {
        for (var vr in data.track.p) {
          if (data.track.p[vr].vid === Client.user.id) {
            data.track.vote = Client.user.w;
            break;
          }
        }
        for (var vr in data.track.n) {
          if (data.track.n[vr].vid === Client.user.id) {
            data.track.vote = -Client.user.w;
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
//      if ($rootScope.scrobble === true) {
//        var request = new XMLHttpRequest();
//        var sig = md5.createHash(localStorage.getItem('lastfmToken'));
//        request.open('POST', 'http://ws.audioscrobbler.com/2.0/?method=track.updateNowPlaying&api_key=4366bdedfe39171be1b5581b52ddee90&api_sig=' + sig + '&artist=' + data.track.a + '&track=' + data.track.t + '&autocorrect=1', true);
//        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
//        request.send(data);
//        console.log('scrobble', data);
//      }
    });

    /* Check votes after signing - for color setting if user voted plus or minus */
    function checkVotes() {
      var plsL = $scope.playlist.length;
      for (var i = 0; i < plsL; i++) {
        for (var vr in $scope.playlist[i].p) {
          if ($scope.playlist[i].p[vr].vid === Client.user.id) {
            $scope.playlist[i].vote = Client.user.w;
            break;
          }
        }
        for (var vr in $scope.playlist[i].n) {
          if ($scope.playlist[i].n[vr].vid === Client.user.id) {
            $scope.playlist[i].vote = -Client.user.w;
            break;
          }
        }
      }
      for (var vr in $scope.track.p) {
        if ($scope.track.p[vr].vid === Client.user.id) {
          $scope.track.vote = Client.user.w;
          break;
        }
      }
      for (var vr in $scope.track.n) {
        if ($scope.track.n[vr].vid === Client.user.id) {
          $scope.track.vote = -Client.user.w;
          break;
        }
      }
    }

    /* Check votes after signing */
    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed === true) {
        checkVotes();
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    /* wtf? i don't know */
    $scope.$watch(function () {
      return $rootScope.load.welcome;
    }, function () {
      if ($rootScope.load.welcome === true) {
        $scope.track = Client.channel.current;
      }
    }, true);

    /* Socket Update track - vote, title or artist */
    socket.on('uptr', function(data) {
      if (data.t.id === Client.channel.current.id) {
        if ($scope.load.signed === true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid === Client.user.id) {
              data.t.vote = Client.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid === Client.user.id) {
              data.t.vote = -1 * Client.user.w;
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
        if ($scope.load.signed === true) {
          for (var vr in data.t.p) {
            if (data.t.p[vr].vid === Client.user.id) {
              data.t.vote = Client.user.w;
              break;
            }
          }
          for (var vr in data.t.n) {
            if (data.t.n[vr].vid === Client.user.id) {
              data.t.vote = -1 * Client.user.w;
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
        if ($scope.load.signed === true) {
          for (var vr in track.p) {
            if (track.p[vr].vid === Client.user.id) {
              track.vote = Client.user.w;
              break;
            }
          }
          for (var vr in track.n) {
            if (track.n[vr].vid === Client.user.id) {
              track.vote = -1 * Client.user.w;
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
      data.chid = Client.channel.id;
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
        if (this.track.vote === -Client.user.w) {
          addVote({ 'id': id, 'v': 0});
        } else {
          addVote({'id': id, 'v': -Client.user.w });
        }
      } else {
        if (this.track.vote === Client.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': Client.user.w });
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
        if (this.track.vote === Client.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': Client.user.w });
        }
      } else {
        if (this.track.vote === -Client.user.w) {
          addVote({ 'id': id, 'v': 0 });
        } else {
          addVote({ 'id': id, 'v': -Client.user.w });
        }
      }
    };

    /* Get data - playlist and current track time postion - for meter */
    socket.on('channeldata', function (data) {
//      console.log('playlist', data);
      $scope.channel = data.name;
      $scope.playlist = data.pls;
      $scope.items = $scope.playlist;
      Client.channel.ct = data.ct;
      $scope.starTimer(Client.channel.ct, data.current.tt);
//      if ($rootScope.scrobble === true) {
//        var request = new XMLHttpRequest();
//        request.open('POST', 'http://ws.audioscrobbler.com/2.0/?api_key=4366bdedfe39171be1b5581b52ddee90&api_sig=' + apiSig + '&artist=' + data.current.a + '&method=track.updateNowPlaying&track=' + data.current.t, true);
//        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
//        request.send(data);
//        console.log('scrobble', data);
//      }
      var plsL = data.pls.length;
      for (var i = 0; i < plsL; i++) {
        $scope.playlist[i].vote = 0;
        $scope.playlist[i].ut = setTimezone($scope.playlist[i].ut);
      }
    });

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

    /*
    function okToGreet(name) {
      return name;
    }

    function asyncGreet(name) {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
      return $q(function(resolve, reject) {
        setTimeout(function() {
          if (okToGreet(name)) {
            resolve('Hello, ' + name + '!');
          } else {
            reject('Greeting ' + name + ' is not allowed.');
          }
        }, 1000);
      });
    }

    var promise = asyncGreet('Robin Hood');
    promise.then(function(greeting) {
      alert('Success: ' + greeting);
    }, function(reason) {
      alert('Failed: ' + reason);
    });
    */

  });
