'use strict';

angular.module('trigger')
  .controller('UserCtrl', function ($scope) {
    $scope.date = new Date();
    $scope.user = {
      'name': 'boocha',
      'id': 1155,
      'img': 'ear.png',
      'karma': 43,
      'n': [
        {
          'id': 432,
          'name': 'Lol'
        },
        {
          'id': 422,
          'name': 'Lol2'
        },
        {
          'id': 442,
          'name': 'Lol3'
        }
      ],
      'p': [
        {
          'id': 432,
          'name': 'Lol'
        },
        {
          'id': 422,
          'name': 'Lol2'
        },
        {
          'id': 442,
          'name': 'Lol3'
        }
      ],
      'regdate': '28.12.2012',
      'description': 'Ну охуеть теперь',
      'father': {
        'id': 333,
        'name': 'DiconFrost'
      },
      'children': [
        {
          'id': 1240,
          'name': 'Morass'
        },
        {
          'id': 1241,
          'name': 'veterrrr'
        },
        {
          'id': 1242,
          'name': 'meloch'
        },
        {
          'id': 1243,
          'name': 'Agbtrgpktrkpen'
        },
        {
          'id': 1244,
          'name': 'ssk'
        }
      ]
    }
  });
