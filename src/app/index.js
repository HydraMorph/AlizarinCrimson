'use strict';

angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'ui.pagedown'])
  .filter('markdown', function() {
      return function(text) {
          if (typeof text == "undefined") {
              return "";
          }
          return markdown.toHTML(String(text));
      }
  });
