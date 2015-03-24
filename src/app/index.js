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
  console.log(angularMomentConfig.timezone);
});

app.run(function ($rootScope, Client, socket, $location, $log, md5) {
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
  var u = localStorage.getItem('username');
  var p = localStorage.getItem('password');

  $rootScope.title = 'Trigger';
  $rootScope.userId = 0;
  $rootScope.scrobble = false;
  var d = new Date()
  $rootScope.timezoneOffset = d.getTimezoneOffset();

  Client.init(location.host); /* Init Client */

  /* Get first data - channel, users, playlist*/
  socket.on('welcome', function (data) {
    Client.channel = data.channels[0];
    Client.getChannels(function(data){
      Client.goChannel(1, console.log('Q' ,data));
      Client.channels = data.channels;
      if (u !== undefined && p !== undefined) {
        Client.login(u, p, processLogin);
      }
    });
    $rootScope.load.welcome = true;
  });
  $rootScope.client = Client;
  /* LastFM с их адской документацией идут к черту. */
//  var lastfmToken = $location.search()['token'];
//  if (lastfmToken && lastfmToken.length > 0) {
//    localStorage.setItem('lastfmToken', lastfmToken);
//    $rootScope.scrobble = true;
//  }
});

