'use strict';

angular.module('trigger')
  .controller('CurrentCtrl', ['$scope', '$interval', function($scope, $interval) {
    $scope.mode = 'query';
    $scope.determinateValue = 0;
    $scope.determinateValue2 = 0;
    $interval(function() {
      $scope.determinateValue += 1;
      $scope.determinateValue2 += 1.5;
      if ($scope.determinateValue > 100) {
        $scope.determinateValue = 0;
        $scope.determinateValue2 = 0;
      }
    }, 100, 0, true);
    $interval(function() {
      $scope.mode = ($scope.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);
    $scope.current = {
      'a': 'CurrentArtist',
      't': 'CurrentTitle',
      's': 'Shepherd',
      'id': 304818,
      'sid': 2043,
      'tt': 262,
      'i': '',
      'tg': [
        {
          "id": 1165,
          "n": "1h mix"
        },
        {
          "id": 1162,
          "n": "lol"
        }
      ],
      'p': [
        {
          'v': 1,
          'vid': 2043,
          'n': 'Shepherd'
        }
      ],
      'n': [],
      'r': 18,
      'src': 'assets/images/nocover.png',
      'vote': 0
    };
  }]);
