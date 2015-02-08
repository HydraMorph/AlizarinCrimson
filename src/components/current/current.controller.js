'use strict';

angular.module('trigger')
  .controller('CurrentCtrl', function($scope, $rootScope, $interval, Client) {

     /*
     * Вообще не знаю почему, но без этой функции не работает логин - не с первого раза получается залогиниться, и голосование за треки начинает вести себя странно.
     */
    $interval(function() {
    }, 100, 0, true);

  });
