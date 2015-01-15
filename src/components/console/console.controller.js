'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $timeout, $mdDialog, $mdBottomSheet) {
//  .controller('ConsoleCtrl', function($scope, $mdDialog) {
//    $scope.showAdvanced = function(ev) {
//      $mdDialog.show({
//        controller: LoginCtrl,
//        templateUrl: 'components/login/login.html',
//        targetEvent: ev,
//      })
//      .then(function(answer) {
//        $scope.alert = 'You said the information was "' + answer + '".';
//      }, function() {
//        $scope.alert = 'You cancelled the dialog.';
//      });
//    };
//  });
//function LoginCtrl($scope, $mdDialog) {
//  $scope.hide = function() {
//    $mdDialog.hide();
//  };
//  $scope.cancel = function() {
//    $mdDialog.cancel();
//  };
//  $scope.answer = function(answer) {
//    $mdDialog.hide(answer);
//  };
//}
    $scope.data = 'Console';
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
