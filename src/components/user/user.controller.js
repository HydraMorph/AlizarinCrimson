/*
* TODO
* 1. Caching profile
* 2. Added vote function
* 3. User img checking and default picture setting
* 4. Regdate i18n
* 5. showProfile(id) function
*/


'use strict';

angular.module('trigger')
  .controller('UserCtrl', function ($scope, $rootScope, Client) {

    /* init */
    $scope.user = {};

    /* Get data after signing */
    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
        Client.getUser({id: $rootScope.userId},function(data){
          if (Client.user.g === undefined) {
            if ($rootScope.userId === Client.user.id) {
              Client.user.g = data.g;
            }
          }
          data.karma = data.p.length - data.n.length;
          data.vote = undefined;
          for (var vr in data.p) {
            if (data.p[vr].vid == Client.user.id) {
              data.vote = 'plus';
              break;
            }
          }
          for (var vr in data.n) {
            if (data.n[vr].vid == Client.user.id) {
              data.vote = 'minus';
              break;
            }
          }
          $scope.user = data;
          $scope.$digest();
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.$watch(function() {
      return $rootScope.userId;
    }, function() {
      /* Hack for user with non-numeric id - trigger */
      var id = $rootScope.userId;
      if (id === 0) {
        id = '0';
      }
      Client.getUser({id: id},function(data){
        data.karma = data.p.length - data.n.length;
        data.vote = undefined;
        for (var vr in data.p) {
          if (data.p[vr].vid == Client.user.id) {
            data.vote = 'plus';
            break;
          }
        }
        for (var vr in data.n) {
          if (data.n[vr].vid == Client.user.id) {
            data.vote = 'minus';
            break;
          }
        }
        console.log(data);
        if (!data.pic) {
          data.pic = '/assets/images/ear.png';
        }
        $scope.user = data;
        $scope.$digest();
      });
    }, true);

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
    }

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
    }

    $scope.avatarUrl = '';
    $scope.previewAvatar = function () {
      $http.get($scope.avatarUrl).success(function(data){
        console.log(data);
      });
    }

  });
