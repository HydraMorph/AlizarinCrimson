'use strict';

var app = angular.module('trigger');

app.factory('Profile', function (socket, Client) {

  var service = {};

  service.getData = function() {
    return service.pls;
  };

  return service;

});
