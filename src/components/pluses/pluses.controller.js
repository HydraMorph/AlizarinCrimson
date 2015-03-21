/*
* TODO:
* 1. Add caching
* 2. Date i18n
* 3. Infinity scroll
*/

'use strict';

angular.module('trigger')
  .controller('PlusesCtrl', function ($scope, $rootScope, Client) {

    /* init */
    $scope.tracks = [];
    $scope.data = {
      id: $rootScope.userId,
      uplshift: 0,
      p: true
    }

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


    $scope.loadMore = function() {
      $scope.data.uplshift = $scope.tracks[$scope.tracks.length-1].tt;
      getHistory($scope.data);
    }

  });
