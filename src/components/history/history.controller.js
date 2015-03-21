/*
* TODO:
* 1. Infinity scroll
* 2. Filter with 'gold' parameter
* 3. Caching data (ng-switch will erase it)
* 4. Autoadding data to history (also, in cache)
* 5. Add additional functions (voters count, links, description, uploader and other
*/
'use strict';

angular.module('trigger')
  .controller('HistoryCtrl', function ($scope, $rootScope, Client, socket) {

    /* Default values */
    $scope.tracks = [];
    $scope.data = {
      shift: 0,
      artist: '',
      title: '',
      gold: false,
      top: false,
      topType: false
    };

    /* Get data after signing */
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    /* Callback function */
    function addHistory(track) {
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
      $scope.tracks.push(track);
    }

    /* Sockets */
    function getHistory(data) {
      socket.emit('gethistory', {
        chid: 1,
        s: data.shift,
        a: data.artist,
        t: data.title,
        top: data.top,
        g: data.gold,
        v: data.topType
      }, function(data) {
        console.log('gethistory', data);
        for (var t in data) {
          addHistory(data[t]);
        }
      });
    }

    /* ng-click */
    $scope.showHistory = function() {
      getHistory($scope.data);
    }
    /* init function */
    getHistory($scope.data);

    $scope.loadMore = function() {
      $scope.data.shift = $scope.tracks[$scope.tracks.length-1].tt;
      console.log($scope.tracks.length, $scope.data.shift);
      getHistory($scope.data);
    }

  });
