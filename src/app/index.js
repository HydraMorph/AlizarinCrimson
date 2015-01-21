'use strict';

angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'ngSocket'])
  .value('nickName', 'true')
  .value('password', '09e7881117ecd5e66723322ef5a6f4e0')
  .module("trigger", ['ngSocket'])
  .config(["$socketProvider", function ($socketProvider) {
    $socketProvider.setUrl("http://trigger.fm");
  }]);
