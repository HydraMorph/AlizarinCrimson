'use strict';

var app = angular.module('trigger');

app.filter('readableTime', function () {
  /* jshint ignore:start */
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
  /* jshint ignore:end */
});
