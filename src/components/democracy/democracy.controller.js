/* Democracy will be replaced */
'use strict';

angular.module('trigger')
  .controller('DemocracyCtrl', function ($scope) {
    $scope.data = {
      selectedIndex : 1
    };
    $scope.president = {
      'name': 'Suok',
      'description': 'упоротый напрочь'
    };
    $scope.moderators = [
      {
        'name': 'bird',
        'id': '1',
        'description': 'упарывается'
      },
      {
        'name': 'Ucsus',
        'id': '1912',
        'description': 'Rudolph'
      },
      {
        'name': 'Fab',
        'id': '234',
        'description': 'Dasher'
      },
      {
        'name': 'Ololo',
        'id': '1234',
        'description': 'редактор'
      },
      {
        'name': 'Lulz',
        'id': '624',
        'description': 'упрт'
      },
      {
        'name': 'Suok',
        'id': '2453',
        'description': 'начальник'
      }
    ];
    $scope.banned = [
      {
        'name': 'bird',
        'id': '1',
        'reason': 'упарывается'
      },
      {
        'name': 'Ucsus',
        'id': '1912',
        'reason': 'Rudolph'
      },
      {
        'name': 'Fab',
        'id': '234',
        'reason': 'Dasher'
      },
      {
        'name': 'Ololo',
        'id': '1234',
        'reason': 'редактор'
      },
      {
        'name': 'Lulz',
        'id': '624',
        'reason': 'упрт'
      },
      {
        'name': 'Suok',
        'id': '2453',
        'reason': 'начальник'
      }
    ];

    $scope.next = function() {
      $scope.data.selectedIndex = Math.min($scope.data.selectedIndex + 1, 2) ;
    };

    $scope.previous = function() {
      $scope.data.selectedIndex = Math.max($scope.data.selectedIndex - 1, 0);
    };
  });
