'use strict';

angular.module('trigger')
  .controller('CurrentCtrl', ['$scope', '$interval', function($scope, $interval, Client) {
    $scope.mode = 'query';
    $scope.determinateValue = 0;
    $scope.determinateValue2 = 0;
    $interval(function() {
      $scope.determinateValue += 1;
      $scope.determinateValue2 += 1.5;
      if ($scope.determinateValue > 100) {
        $scope.determinateValue = 0;
        $scope.determinateValue2 = 0;
      }
    }, 100, 0, true);
    $interval(function() {
      $scope.mode = ($scope.mode == 'query' ? 'determinate' : 'query');
    }, 7200, 0, true);

    console.log('Current', Client);
    $(Client).bind('newcurrent', function(event, data) {
      console.log(data);
    });
//      if (data.chid == Client.channel.chid) {
//        setCurrent(data.track);
//        setcurtime(true);
//      }
//      $('#info .content.channels #' + data.chid + ' .current').html('<div class="cap">РЎРµР№С‡Р°СЃ:</div><div class="artist">' + data.track.a + '</div><div class="title">' + data.track.t + '</div><span><a href="http://vk.com/audio?q=' + encodeURIComponent(data.track.a) + ' - ' + encodeURIComponent(data.track.t) + '" target="_blank">>vk</a></span>');

    $scope.current = Client.channel.current;
  }]);
