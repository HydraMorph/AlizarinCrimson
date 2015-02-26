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
  .controller('HistoryCtrl', function ($scope, Client, socket) {

    $scope.tracks = [];
    $scope.data = {
      shift: 0,
      artist: '',
      title: '',
      gold: false,
      top: false
    };

    function addHistory(track) {
      $scope.tracks.push(track);
    }

    function getHistory(data) {
      $scope.tracks = [];
      socket.emit('gethistory', {
        chid: 1,
        s: data.shift,
        a: data.artist,
        t: data.title,
        top: data.top,
        g: data.gold
      }, function(data) {
        console.log('gethistory', data);
        for (var t in data) {
          addHistory(data[t]);
        }
      });
    }

    $scope.showHistory = function() {
      getHistory($scope.data);
    }
    $scope.showHistory()


  });
