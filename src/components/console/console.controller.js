'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $timeout, $mdBottomSheet) {
    $scope.data = "Console";
    $scope.volume = 23;
    $scope.changeVolume = function(volume) {
      $scope.volume = volume;
    };
    $scope.openUploadBar = function($event) {
      $scope.alert = '';
      $mdBottomSheet.show({
        templateUrl: 'components/upload/upload.html',
        controller: 'UploadCtrl',
        targetEvent: $event
      }).then(function(clickedItem) {
        $scope.alert = clickedItem.name + ' clicked!';
      });
    };
  });
