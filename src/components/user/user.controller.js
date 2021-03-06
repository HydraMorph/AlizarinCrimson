'use strict';

angular.module('trigger')
  .controller('UserCtrl', function ($scope, $rootScope, Client, $mdToast, User) {

    /* init */
    $scope.user = {};

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


    /* Get data after signing */
    /* jshint shadow:true */
    $scope.$watch(User.isAuth, function(value) {
      $scope.load.signed = value;
      if (value === true) {
        var userId = User.getProfileId;
        Client.getUser({id: userId},function(data){
          if (Client.user.g === undefined) {
            if (userId === Client.user.id) {
              Client.user.g = data.g;
            }
          }
          data.karma = data.p.length - data.n.length;
          data.vote = undefined;
          for (var vr in data.p) {
            if (data.p[vr].vid === Client.user.id) {
              data.vote = 'plus';
              break;
            }
          }
          for (var vr in data.n) {
            if (data.n[vr].vid === Client.user.id) {
              data.vote = 'minus';
              break;
            }
          }
          $scope.user = data;
          $scope.$digest();
        });
      }
    });

    $scope.$watch(User.getProfileId, function(value) {
      /* Hack for user with non-numeric id - trigger */
      if ($scope.load.signed === true) {
        var id = value;
        if (id === 0) {
          id = '0';
        }
        Client.getUser({id: id},function(data){
          data.karma = data.p.length - data.n.length;
          data.vote = undefined;
          for (var vr in data.p) {
            if (data.p[vr].vid === Client.user.id) {
              data.vote = 'plus';
              break;
            }
          }
          for (var vr in data.n) {
            if (data.n[vr].vid === Client.user.id) {
              data.vote = 'minus';
              break;
            }
          }
          console.log(data);
          if (!data.pic) {
            data.pic = '/assets/images/ear.png';
          }
          var img = new Image();
          img.src = data.pic;
          img.onerror = function() {
            data.pic = '/assets/images/ear.png';
          };
          $scope.user = data;
          $scope.$digest();
        });
      }
    });

    function callback() {
    }
    $scope.userVoteDown = function (id) {
      var vote = -1;
      if ($scope.user.vote === 'minus') {
        vote = 0;
      }
      Client.adduservote({ 'v': vote, 'id': id }, callback);
      if (vote === 0) {
        $scope.user.vote = '';
        $scope.user.karma++;
      } else {
        $scope.user.vote = 'minus';
        $scope.user.karma--;
      }
    };

    $scope.userVoteUp = function (id) {
      var vote = 1;
      if ($scope.user.vote === 'plus') {
        vote = 0;
      }
      Client.adduservote({ 'v': vote, 'id': id }, callback);
      if (vote === 0) {
        $scope.user.vote = '';
        $scope.user.karma--;
      } else {
        $scope.user.vote = 'plus';
        $scope.user.karma ++;
      }
    };

    $scope.avatarUrl = '';
    $scope.previewAvatar = function () {
      var img = new Image();
      img.src = $scope.avatarUrl;
      img.onload = function() {
        $scope.user.pic = $scope.avatarUrl;
        $scope.save = true;
      };
      img.onerror = function() {
        $mdToast.show(
          $mdToast.simple()
            .content('Can\'t find image! URL is incorrect!')
            .position($scope.getToastPosition())
            .hideDelay(3000)
        );
      };
    };

    $scope.edit = false;
    $scope.save = false;
    $scope.editAvatar = function () {
      if ($scope.edit === true) {
        $scope.edit = false;
      } else {
        $scope.edit = true;
      }
    };
    $scope.saveAvatar = function () {
      Client.updateUserData({ pic: $scope.avatarUrl });
      $scope.edit = false;
      $scope.save = false;
      $mdToast.show(
        $mdToast.simple()
          .content('Your avatar is changed! ^_^')
          .position($scope.getToastPosition())
          .hideDelay(3000)
      );
    };

  });
