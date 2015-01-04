'use strict';

angular.module('trigger')
  .controller('CurrentCtrl', function ($scope) {
    $scope.current = {
      'a': 'CurrentArtist',
      't': 'CurrentTitle',
      's': 'Shepherd',
      'id': 304818,
      'sid': 2043,
      'tt': 262,
      'i': '',
      'tg': [],
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
  });
