'use strict';

angular.module('trigger')
  .filter('timeago', function () {
    return function (input, p_allowFuture) {
      var substitute = function (stringOrFunction, number, strings) {
          var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, dateDifference) : stringOrFunction;
          var value = (strings.numbers && strings.numbers[number]) || number;
          return string.replace(/%d/i, value);
        },
        nowTime = (new Date()).getTime(),
        date = (new Date(input)).getTime(),
        //refreshMillis= 6e4, //A minute
        allowFuture = p_allowFuture || false,
        strings = {
          prefixAgo: null,
          prefixFromNow: null,
          suffixAgo: "назад",
          suffixFromNow: "",
          seconds: "меньше минуты",
          minute: "больше минуты",
          minutes: "%d минут",
          hour: "около часа",
          hours: "%d часов",
          day: "день",
          days: "%d дней",
          month: "около месяца",
          months: "%d месяцев",
          year: "около года",
          years: "%d лет"
        },
        dateDifference = nowTime - date,
        words,
        seconds = Math.abs(dateDifference) / 1000,
        minutes = seconds / 60,
        hours = minutes / 60,
        days = hours / 24,
        years = days / 365,
        separator = strings.wordSeparator === undefined ? " " : strings.wordSeparator,

        // var strings = this.settings.strings;
        prefix = strings.prefixAgo,
        suffix = strings.suffixAgo;

      if (allowFuture) {
        if (dateDifference < 0) {
          prefix = strings.prefixFromNow;
          suffix = strings.suffixFromNow;
        }
      }

      words = seconds < 45 && substitute(strings.seconds, Math.round(seconds), strings) ||
        seconds < 90 && substitute(strings.minute, 1, strings) ||
        minutes < 45 && substitute(strings.minutes, Math.round(minutes), strings) ||
        minutes < 90 && substitute(strings.hour, 1, strings) ||
        hours < 24 && substitute(strings.hours, Math.round(hours), strings) ||
        hours < 42 && substitute(strings.day, 1, strings) ||
        days < 30 && substitute(strings.days, Math.round(days), strings) ||
        days < 45 && substitute(strings.month, 1, strings) ||
        days < 365 && substitute(strings.months, Math.round(days / 30), strings) ||
        years < 1.5 && substitute(strings.year, 1, strings) ||
        substitute(strings.years, Math.round(years), strings);

      return $.trim([prefix, words, suffix].join(separator));
      // conditional based on optional argument
      // if (somethingElse) {
      //     out = out.toUpperCase();
      // }
      // return out;
    }
  })
  .controller('ChatCtrl', function ($scope, $rootScope, Client) {
    $scope.message = '';
    $scope.messages = [];
    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed == true) {
        $(Client).bind('message', function (event, data) {
          $scope.messages.push(data);
          console.log(data);
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
    $scope.sendMessage = function () {
      Client.sendMessage($scope.message, function (data) {
        if (data.error) {
          //          $('#messageinput').attr("placeholder", data.error);
          console.log(data.error);
        } else {
          console.log(data);
          //          $('#messageinput').attr("placeholder", "РЅР°С‡РёРЅР°Р№ РІРІРѕРґРёС‚СЊ...");
        }
      });
    }
  });
