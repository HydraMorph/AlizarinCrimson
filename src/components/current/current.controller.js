'use strict';

angular.module('trigger')
//  .directive('currentTrack', function(Client) {
//    return {
//      scope: {
////        current:
//      },
//      restrict: 'E',
//      templateUrl: '../components/current/_template.html',
//      controller:function($scope, socket) {}
//    };
//  })
  .controller('CurrentCtrl', function($scope, $rootScope, $interval, Client) {
//    $scope.mode = 'query';
//    $scope.determinateValue = 0;
//    $scope.determinateValue2 = 0;
//    $interval(function() {
//      $scope.determinateValue += 1;
//      $scope.determinateValue2 += 1.5;
//      if ($scope.determinateValue > 100) {
//        $scope.determinateValue = 0;
//        $scope.determinateValue2 = 0;
//      }
//    }, 100, 0, true);
//    $interval(function() {
//      $scope.mode = ($scope.mode == 'query' ? 'determinate' : 'query');
//    }, 7200, 0, true);

//    $scope.$watch(function() {
//      return $rootScope.load.welcome;
//    }, function() {
//      if ($rootScope.load.welcome == true) {
//        $scope.current = Client.channel.current;
//        console.log('welcooome', Client);
//        $rootScope.load.playlist = true;
//        $(Client).bind('newcurrent', function(event, data) {
//          Client.channel.current = data.track;
//          if ($scope.load.signed == true) {
//            for (var vr in data.track.p) {
//              if (data.track.p[vr].vid == Client.user.id) {
//                data.track.vote = Client.user.w;
//                break;
//              }
//            }
//            for (var vr in data.track.n) {
//              if (data.track.n[vr].vid == Client.user.id) {
//                data.track.vote = -1*Client.user.w;
//                break;
//              }
//            }
//          } else {
//            data.track.vote = 0;
//          }
//          $scope.current = data.track;
//          console.log('newcurrent', data);
//        });
//      }
////      $scope.load.welcome = $rootScope.load.welcome;
//    }, true);
//    Client.include();
//    $(Client).bind('trackupdate', function(event, data) {
//      if (data.current) {
//        data.t.current = true;
//      }
//      $scope.current = data;
//      console.log(data);
//    });

//      if (data.chid == Client.channel.chid) {
//        setCurrent(data.track);
//        setcurtime(true);
//      }
//      $('#info .content.channels #' + data.chid + ' .current').html('<div class="cap">РЎРµР№С‡Р°СЃ:</div><div class="artist">' + data.track.a + '</div><div class="title">' + data.track.t + '</div><span><a href="http://vk.com/audio?q=' + encodeURIComponent(data.track.a) + ' - ' + encodeURIComponent(data.track.t) + '" target="_blank">>vk</a></span>');

  });
