'use strict';

var app = angular.module('trigger', ['angular-loading-bar', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io', 'luegg.directives', 'angularMoment', 'ngTimezone', 'ngMdIcons', 'cfp.hotkeys', 'vs-repeat', 'pascalprecht.translate', 'ngAudio']);

/* Angular material theme */
app
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange');
  })
  /* angular-loading-bar style */
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

/* angularMoment locale */
//app.run(function(amMoment) {
//  amMoment.changeLocale('ru');
//  amMoment.changeLocale('ru');
//});

app.run(function($timezone, angularMomentConfig) {
  angularMomentConfig.preprocess = 'utc';
  angularMomentConfig.timezone = $timezone.getName();
});

app.run(function ($rootScope, Client) {

  /* init */
  $rootScope.load = {
    'signed': false,
    'welcome': false,
    'playlist': false,
    'channel': false
  };

  $rootScope.channel = {};
  /* login callback */
  function processLogin (data) {
    if (data.error) {
      console.log(data.error);
    } else {
      Client.user = data.user;
      $rootScope.userId = data.user.id;
      $rootScope.load.signed = true;
//      Client.goChannel(1, console.log('Q' ,data));
//      Client.getChannels(function(data){
//        $rootScope.channel = data;
//        console.log(data);
//        $rootScope.load.channel = true;
//      });
    }
  }

  $rootScope.title = 'Trigger';
  $rootScope.userId = 0;
  $rootScope.scrobble = false;
  var d = new Date();
  $rootScope.timezoneOffset = d.getTimezoneOffset();

  Client.init(location.host); /* Init Client */

  var u = localStorage.getItem('username');
  var p = localStorage.getItem('password');
  if (u !== undefined && p !== undefined) {
    Client.login(u, p, processLogin);
  }

//  /* Get first data - channel, users, playlist*/
//  socket.on('welcome', function (data) {
//    console.log('welcome', data);
//    Client.channel = data.channels[0];
//    Client.getChannels(function(data){
//      Client.channels = data.channels;
//      if (u !== undefined && p !== undefined) {
//        Client.login(u, p, processLogin);
//      }
//      Client.goChannel(1, console.log('Q' ,data));
//    });
//    $rootScope.load.welcome = true;
//  });

  $rootScope.client = Client;
});
