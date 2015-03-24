'use strict';

var app = angular.module('trigger');

app.service('Channel', function(socket) {
  this.data = {};
  this.init = function () {
    var t = this;
    socket.on('channeldata', function (data) {
      console.log('channeldata', data);
      t.data = data;
    });
    socket.on('lst', function(data) {
      console.log('lst', data);
      this.data.a = data.a;
      this.data.lst = data.lst;
    });
  };
  this.setNewCurrent = function(track) {
    this.data.current = track;
  };
  this.update = function(type, value) {
    this.data[type] = value;
  };
});
