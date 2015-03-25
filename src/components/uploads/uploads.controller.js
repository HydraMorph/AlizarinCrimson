/*
* TODO:
* 1. Add caching
* 2. Date i18n
* 3. Infinity scroll
*/

'use strict';

angular.module('trigger')
  .controller('UploadsCtrl', function ($scope, $rootScope, Client) {

    /* init */
    $scope.tracks = [];
    $scope.date = moment();
    $scope.data = {
      id: $rootScope.userId,
      uplshift: 0
    };

    /* Get tracks after signing */
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        getHistory($scope.data);
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    function addHistory(track) {
      if (moment.utc($scope.date).format() > moment.utc(track.tt).format()) {
        $scope.date = track.tt;
      }
      $scope.tracks.push(track);
    }

    /* Sockets */
    function getHistory(data) {
      Client.getUser(data, function(data) {
        for (var t in data) {
          addHistory(data[t]);
        }
        $scope.$digest();
      });
    }

    function addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes*60000);
    }

    $scope.loadMore = function() {
      var date = {
        utc: $scope.date,
        offset: -1*$rootScope.timezoneOffset
      };
      var d = new Date($scope.date);
      date.utc = addMinutes(d, date.offset);
      $scope.data.uplshift = date.utc;
      getHistory($scope.data);
    };

  });
