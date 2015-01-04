'use strict';

angular.module('trigger')
  .filter('readableTime', function() {
    return function (seconds) {
      var seconds = parseInt(seconds, 10);
      var hrs, mins, secs;
      switch (false) {
        case !(seconds < 60):
          secs = seconds;
          break;
        case !(seconds < 3600):
          // Minutes and seconds
          mins = ~~(seconds / 60);
          secs = seconds % 60;
          break;
        default:
          // Hours, minutes and seconds
          hrs = ~~(seconds / 3600);
          mins = ~~((seconds % 3600) / 60);
          secs = seconds % 60;
      }
      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";
      if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
      if (mins > 0) {
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      } else {
        ret += "0:";
      }
      ret += "" + secs;
      return ret;
    };
  })
  .controller('PlaylistCtrl', function ($scope) {
    $scope.playlist = [
      {
        'a': 'P.O.D.',
        't': 'Youth of the Nation',
        's': 'Shepherd',
        'id': 304818,
        'sid': 2043,
        'tt': 23,
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
        'r': 10,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Syberian Beast meets Mr.Moore',
        't': 'Wien (Original Mix)',
        's': 'Shepherd',
        'id': 304819,
        'sid': 2043,
        'tt': 218,
        'i': '',
        'tg': [],
        'p': [
          {
            'v': 1,
            'vid': 2481,
            'n': 'Renar'
          }
        ],
        'n': [],
        'r': 7,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Vitalic',
        't': ' Poison Lips',
        's': 'Shepherd',
        'id': 304820,
        'sid': 2043,
        'tt': 236,
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
        'r': 12,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Arure',
        't': 'Civili Builders',
        's': 'Fabeltier',
        'id': 304805,
        'sid': 1499,
        'tt': 186,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': 0,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'The Captain Flatcap',
        't': 'In the Summertime (Swing Hop Mix)',
        's': 'Fabeltier',
        'id': 304806,
        'sid': 1499,
        'tt': 266,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': -2,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Martins Garden',
        't': 'Athos (Sin vocales)',
        's': 'Fabeltier',
        'id': 304807,
        'sid': 1499,
        'tt': 434,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': 1,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Tack',
        't': 'Junky Bluesy',
        's': 'Fabeltier',
        'id': 304808,
        'sid': 1499,
        'tt': 330,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': 7,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Tribone',
        't': 'Proper Stomper',
        's': 'Fabeltier',
        'id': 304809,
        'sid': 1499,
        'tt': 379,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': 5,
        'src': 'assets/images/nocover.png',
        'vote': 0
      },
      {
        'a': 'Poppa Doses ',
        't': 'Ruff Up (The Widdler RMX)',
        's': 'Fabeltier',
        'id': 304810,
        'sid': 1499,
        'tt': 268,
        'i': '',
        'tg': [],
        'p': [],
        'n': [],
        'r': 5,
        'src': 'assets/images/nocover.png',
        'vote': 0
      }
    ];
    $scope.voteUp = function(id) {
      console.log(id);
    };
    $scope.voteDown = function(id) {
      console.log(id);
    };
  });
