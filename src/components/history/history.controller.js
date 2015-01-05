'use strict';

angular.module('trigger')
  .controller('HistoryCtrl', function ($scope) {
    $scope.date = new Date();
    $scope.tracks = [
      {
        'who': '1',
        'what': '111'
      },
      {
        'who': '1',
        'what': '111'
      },
      {
        'who': '1',
        'what': '111'
      },
      {
        'who': '1',
        'what': '111'
      },
      {
        'who': '1',
        'what': '111'
      },
      {
        'who': '1',
        'what': '111'
      }
    ];
  });
