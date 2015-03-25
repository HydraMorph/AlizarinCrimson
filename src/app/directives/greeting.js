'use strict';

var app = angular.module('trigger');

app.directive('greeting', ['$interval', '$translate',  function ($interval, $translate) {
  return {
    restrict: 'AE',
    link:function($scope, element, attrs) {
      var greetingsLang = $translate.preferredLanguage();
      var greetings = {
        'ru': [
          'А ты тоже ждешь 80 порт как и я, username?',
          'Тыц-тыц, username, унц-унц, username!',
          'Когда–то инвайт давали за +11, username.',
          'Не бери треки у наркоманов, username!',
          'Не всё то чилл, что уныло, username!',
          'Не весь метал одинаково полезен, username!',
          'Это не баян, это ротация, username'
        ],
        'en': [
          'Let\'s dance, username?',
          'Let\'s do lunch sometime, username',
          'I\'ve been there., username',
          'Do you hear me, username?'
        ],
        'he': [
          'Lol, username'
        ]
      };
      var greeting = greetings[greetingsLang][Math.floor(Math.random() * greetings[greetingsLang].length)].replace('username', $scope.user.name);
      element.html(greeting);
      $interval(function(){
        greeting = greetings[greetingsLang][Math.floor(Math.random() * greetings[greetingsLang].length)].replace('username', $scope.user.name);
        element.html(greeting);
      }, 9000);
    }
  }
}]);
