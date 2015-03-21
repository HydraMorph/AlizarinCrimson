'use strict';

angular.module('trigger')
  .controller('SettingsCtrl', function ($scope, Client, md5, $mdToast, $animate, $http) {

    $scope.gender = !Client.user.g;
    $scope.changeGender = function() {
      if ($scope.gender == true) {
        Client.user.g = false;
      } else {
        Client.user.g = true;
      }
      Client.updateUserData({ g: !$scope.gender });
    }

    $scope.toastPosition = {
      bottom: false,
      top: true,
      left: false,
      right: true
    };
    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    $scope.oldPassword = '';
    $scope.newPassword = '';
    $scope.newPasswordFix = '';
    $scope.changePassword = function() {
      if ($scope.newPassword.length > 0 && $scope.newPassword === $scope.newPasswordFix) {
        var oldPassword = md5.createHash($scope.oldPassword);
        var newPassword = md5.createHash($scope.newPassword);
        Client.changepass(oldPassword, newPassword, function(data) {
          console.log(data);
          if (data.ok) {
            $mdToast.show(
              $mdToast.simple()
                .content('Все получилось!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          } else {
            $mdToast.show(
              $mdToast.simple()
                .content('Что-то пошло не так!')
                .position($scope.getToastPosition())
                .hideDelay(3000)
            );
          }
        });
      } else {
        $mdToast.show(
          $mdToast.simple()
            .content('Пароли не совпадают!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      }
    }

    function ScrobbleOn(){
      window.open('http://www.lastfm.ru/api/auth?api_key=66101f9355c9c707b5608bc42c62d860&cb=http%3A%2F%2F'+window.location.host+'','Last.fm','width=940,height=580');
      return false;
    }

    /* Under development */
    $scope.initLast = function() {
      ScrobbleOn();
//      var request = new XMLHttpRequest();
//      var url = encodeURIComponent('http://www.last.fm/api/auth/?api_key=66101f9355c9c707b5608bc42c62d860');
//      request.open('GET', url, true);
//      request.onload = function() {
//        if (request.status >= 200 && request.status < 400) {
//          // Success!
//          var resp = request.responseText;
//        } else {
//          // We reached our target server, but it returned an error
//        }
//      };
//      request.onerror = function() {
//        // There was a connection error of some sort
//      };
//      request.send();
//      $http({method: 'GET', url: '//last.fm/api/auth/?api_key=66101f9355c9c707b5608bc42c62d860&cb=http://example.com'})
//      .success(function(d){ console.log( "yay" ); })
//      .error(function(d){ console.log( "nope" ); });
    }

  });
