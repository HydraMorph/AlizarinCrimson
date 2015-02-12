'use strict';

var app = angular.module('trigger');

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.filter('readableTime', function () {
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
    // Output like '1:01' or '4:03:59' or '123:03:59'
    var ret = '';
    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }
    if (mins > 0) {
      ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    } else {
      ret += '0:';
    }
    ret += '' + secs;
    return ret;
  };
});

app.filter('timeago', function () {
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
        suffixAgo: 'назад',
        suffixFromNow: 'только что',
        seconds: 'меньше минуты',
        minute: 'только что',
        minutes: '%d минут',
        hour: 'около часа',
        hours: '%d часов',
        day: 'день',
        days: '%d дней',
        month: 'около месяца',
        months: '%d месяцев',
        year: 'около года',
        years: '%d лет'
      },
      dateDifference = nowTime - date,
      words,
      seconds = Math.abs(dateDifference) / 1000,
      minutes = seconds / 60,
      hours = minutes / 60,
      days = hours / 24,
      years = days / 365,
      separator = strings.wordSeparator === undefined ? ' ' : strings.wordSeparator,

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
  };
});


