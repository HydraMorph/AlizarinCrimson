'use strict';

var app = angular.module('trigger');

app.factory('User', function (socket, Client) {

  var service = {};
  var auth = false;
  var limit;
  var username = '%username%';
  var uservote = 0;

  /* login callback */
  function processLogin (data) {
    console.log('processLogin', data);
    if (data.error) {
      service.data = data;
    } else {
      service.data = data;
      limit = data.user.t;
      username = data.user.n;
      uservote = data.user.w;
      auth = true;
    }
  }

  socket.on('uplim', function(data) {
    limit = data.t;
  });

  service.login = function(u, p) {
    Client.login(u, p, processLogin);
  };

  service.isAuth = function() {
    return auth;
  };

  service.getLimit = function() {
    return limit;
  };

  service.getUsername = function() {
    return username;
  };

  service.getUservote = function() {
    return uservote;
  };

  service.getData = function() {
    return service.data;
  };

  return service;

});
