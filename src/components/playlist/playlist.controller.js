'use strict';

angular.module('trigger')
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client, socket, $interval) {

    $scope.reverse = 0;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 960) {
      $scope.reverse = 1;
    }

    $scope.toggleLeft = function () {
      $mdSidenav('left').toggle();
    };
    $scope.toggleRight = function () {
      $mdSidenav('right').toggle();
    };

    $scope.load.signed = false;

    $scope.playlist = [];
    $scope.track = {};

    $scope.$watch(function () {
      return $rootScope.load.welcome;
    }, function () {
      if ($rootScope.load.welcome === true) {
        $scope.track = Client.channel.current;
        $rootScope.title = '+D' + Client.channel.current.a + ' - ' + Client.channel.current.t + ' @ Trigger';
      }
    }, true);

    socket.on('newcurrent', function(data) {
      console.log('newcurrent', data);
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

    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed === true) {
        checkVotes();
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.$watch(function () {
      return $rootScope.load.welcome;
    }, function () {
      if ($rootScope.load.welcome === true) {
        $scope.track = Client.channel.current;
      }
    }, true);

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
        $scope.track = data.t;
      } else {
        var plLength = $scope.playlist.length;
        var id;
        for (var i = 0; i < plLength; i++) {
          if ($scope.playlist[i].id === data.t.id) {
            id = i;
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

    socket.on('addtrack', function(data) {
      console.log('addtrack', data);
      data.track.src = 'img/nocover.png';
      var track = data.track;
      track.vote = 0;
      var plLength = $scope.playlist.length;
      var isClone = false;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.id) {
          isClone = true;
          break;
        }
      }
      if (isClone === false) {
        if ($scope.load.signed === true) {
          for (var vr in data.p) {
            if (data.p[vr].vid === Client.user.id) {
              data.vote = Client.user.w;
              break;
            }
          }
          for (var vr in data.n) {
            if (data.n[vr].vid === Client.user.id) {
              data.vote = -1 * Client.user.w;
              break;
            }
          }
        }
        $scope.playlist.push(track);
      }
    });

    socket.on('removetrack', function(data) {
      console.log('removetrack', data);
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.tid) {
          $scope.playlist.splice(i, 1);
          break;
        }
      }
    });

    $scope.voteUp = function (id) {
      var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      var reverse = false;
      if (width <= 960) {
        reverse = true;
      }
      if (reverse === true) {
        if (this.track.vote === -Client.user.w) {
          Client.addvote({
            'id': id,
            'v': 0
          });
        } else {
          Client.addvote({
            'id': id,
            'v': -Client.user.w
          });
        }
      } else {
        if (this.track.vote === Client.user.w) {
          Client.addvote({
            'id': id,
            'v': 0
          });
        } else {
          Client.addvote({
            'id': id,
            'v': Client.user.w
          });
        }
      }
    };


    $scope.voteDown = function (id) {
      var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
      var reverse = false;
      if (width <= 960) {
        reverse = true;
      }
      if (reverse === true) {
        if (this.track.vote === Client.user.w) {
          Client.addvote({
            'id': id,
            'v': 0
          });
        } else {
          Client.addvote({
            'id': id,
            'v': Client.user.w
          });
        }
      } else {
        if (this.track.vote === -Client.user.w) {
          Client.addvote({
            'id': id,
            'v': 0
          });
        } else {
          Client.addvote({
            'id': id,
            'v': -Client.user.w
          });
        }
      }
    };

    // I hold the data being rendered in the ng-repeat.
    socket.on('channeldata', function (data) {
//      console.log('playlist', data.pls);
      $scope.playlist = data.pls;
      $scope.items = $scope.playlist;
      Client.channel.ct = data.ct;
      $scope.starTimer(Client.channel.ct, data.current.tt);
      $scope.current = data.current;
      var plsL = data.pls.length;
      for (var i = 0; i < plsL; i++) {
        $scope.playlist[i].vote = 0;
      }
    });

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
