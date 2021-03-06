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

  $rootScope.title = 'Trigger';
  $rootScope.userId = 0;

  var d = new Date();
  $rootScope.timezoneOffset = d.getTimezoneOffset();

  Client.init(location.host); /* Init Client */


});
