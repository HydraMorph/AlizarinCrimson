'use strict';

angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io'])
  .value('nickName', 'true')
  .value('password', '09e7881117ecd5e66723322ef5a6f4e0')
  .factory('socket', function (socketFactory) {
    var myIoSocket = io.connect('http://trigger.fm');
    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });
    return mySocket;
  });
