'use strict';

angular.module('trigger')
  .controller('ChatCtrl', function ($scope, $rootScope, Client) {
    $scope.message = '';
    $scope.messages = [];
    $scope.$watch(function () {
      return $rootScope.load.signed;
    }, function () {
      if ($rootScope.load.signed == true) {
        Client.getChat({}, function(d) {
          $scope.messages = d.m;
          $scope.$digest();
          console.log(d);
        });
        $(Client).bind('message', function (event, data) {
          console.log(data.m);
          $scope.messages.push(data);
//          console.log(data);
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);
    $scope.sendMessage = function () {
      Client.sendMessage($scope.message, function (data) {
        $scope.messages.push(data);
        $scope.$digest();
        if (data.error) {
          //          $('#messageinput').attr("placeholder", data.error);
          console.log(data.error);
        } else {
          console.log(data);
          //          $('#messageinput').attr("placeholder", "РЅР°С‡РёРЅР°Р№ РІРІРѕРґРёС‚СЊ...");
        }
      });
      $scope.message = '';
    };
  });
