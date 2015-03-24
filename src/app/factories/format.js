'use strict';

var app = angular.module('trigger');

app.factory('Format', function(){
  return {
    data: {
      mp3: '',
      ogg: '',
      stream: ''
    },
    update: function(type, value) {
      this.data[type] = value;
    }
  };
});
