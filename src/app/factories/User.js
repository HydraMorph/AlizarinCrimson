'use strict';

var app = angular.module('trigger');

app.factory('User', function (socket, Client) {

  var service = {};
  var auth = false;

  /* login callback */
  function processLogin (data) {
    console.log('processLogin', data);
    if (data.error) {
      service.data = data;
    } else {
      service.data = data;
      auth = true;
    }
  }

  service.login = function(u, p) {
    Client.login(u, p, processLogin);
  };

  service.setData = function(data) {
    service = data;
  };

  service.getData = function() {
    return service.data;
  };

  return service;

});
