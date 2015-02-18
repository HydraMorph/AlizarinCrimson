'use strict';

angular.module('trigger')
  .controller('PlaylistCtrl', function ($scope, $rootScope, $mdSidenav, Client, socket, trackCoverService) {

    trackCoverService.getArtists('Jon Kennedy', 'Sand People')
      .success(function(response) {
        return response.track.album.image[0]['#text'];
      }
    );

    $scope.reverse = false;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width <= 960) {
      $scope.reverse = true;
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
        console.log('welcooome', Client);
      }
    }, true);

    $(Client).bind('newcurrent', function (event, data) {
      Client.channel.current = data.track;
      $scope.track = data.track;
      $rootScope.title = '! ' + data.track.a + ' - ' + data.track.t + ' @ Trigger';
      $scope.$digest();
      console.log('newcurrent', data);
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

    function setCovers () {
      var plsL = $scope.playlist.length;
      for (var i = 0; i < plsL; i++) {
        var track = $scope.playlist[i];
        track.src = 'assets\\images\\nocover.png';
        trackCoverService.getArtists(track.a, track.t)
          .success(function(response) {
            console.log('success', response.track.album.image[0]['#text']);
            track.src = response.track.album.image[0]['#text'];
          });
        $scope.playlist[i] = track;
      }
      $scope.$digest();
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

    $(Client).bind('trackupdate', function (event, data) {
      console.log('trackupdate', data);
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
        console.log('currentUpdate', data.t);
      } else {
        var plLength = $scope.playlist.length;
        var id;
        for (var i = 0; i < plLength; i++) {
          if ($scope.playlist[i].id === data.t.id) {
            id = i;
            $scope.playlist[i] = data.t;
            console.log($scope.playlist[i]);
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
      $scope.$digest();
      console.log('trackupdate', data.t);
    });

    $(Client).bind('addtrack', function (event, data) {
      var plLength = $scope.playlist.length;
      var isClone = false;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.track.id) {
          isClone = true;
          console.log($scope.playlist[i]);
          break;
        }
      }
      if (isClone === false) {
        for (var vr in data.track.p) {
          if (data.track.p[vr].vid === Client.user.id) {
            console.log('voted+', data.track.p[vr]);
            break;
          }
        }
        for (var vr in data.track.n) {
          if (data.track.n[vr].vid === Client.user.id) {
            console.log('voted-', data.track.p[vr]);
            break;
          }
        }
        trackCoverService.getArtists(data.track.a, data.track.t)
          .success(function(response) {
            data.track.src = response.track.album.image[0]['#text'];
          })
          .error(function(response) {
            data.track.src = '\assets\images]nocover.png';
          });

        $scope.playlist.push(data.track);
      }
      console.log('addtrack', data.track);
    });

    $(Client).bind('removetrack', function (event, data) {
      var plLength = $scope.playlist.length;
      for (var i = 0; i < plLength; i++) {
        if ($scope.playlist[i].id === data.track.id) {
          console.log('removetrack', i, data.track.id);
          $scope.playlist.splice(i, 1);
          break;
        }
      }
    });
    //
    $scope.voteUp = function (id) {
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
    };

    $scope.voteDown = function (id) {
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
    };

    // I hold the data being rendered in the ng-repeat.
    socket.on('channeldata', function (data) {
      console.log('playlist', data.pls);
      $scope.playlist = data.pls;
      setCovers();
      $scope.$digest();
      $scope.items = $scope.playlist;
      $scope.current = data.current;
      var plsL = data.pls.length;
      for (var i = 0; i < plsL; i++) {
        $scope.playlist[i].vote = 0;
      }
    });

  });
