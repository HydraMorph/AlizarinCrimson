'use strict';

var app = angular.module('trigger');

app.factory('Channel', function (socket, Client) {

  var service = {};
  var description = '';
  var users = [];

  /* Get first data - channel, users, playlist*/
  socket.on('welcome', function (data) {
    console.log('welcome', data);
    Client.getChannels(function(data) {
      users = data.channels[0].users;
      Client.goChannel(1, description = data.channels[0].description);
    });
  });

  service.setData = function(data) {
    service = data;
  };

  socket.on('channeldata', function(data) {
    console.log('channeldata', data);
    service.setData(data);
  });

  service.getId = function() {
    return service.chid;
  };

  service.getProgress = function() {
    return service.ct;
  };

  service.getDescription = function() {
    return description;
  };

  service.getActiveUsers = function() {
    return service.a;
  };

  service.getListeners = function() {
    return service.lst;
  };

  socket.on('lst', function(data) {
    service.lst = data.l;
    service.a = data.a;
  });

  service.getUsers = function() {
    return users;
  };

  service.getCurrent = function() {
    return service.current;
  };

  service.getPlaylist = function() {
    return service.pls;
  };

  return service;

});
