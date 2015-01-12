'use strict';

angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial'])
  .filter('markdown', function() {
      return function(text) {
          if (typeof text == "undefined") {
              return "";
          }
          return markdown.toHTML(String(text));
      }
  });
