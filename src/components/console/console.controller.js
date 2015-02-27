'use strict';

angular.module('trigger')
  .controller('ConsoleCtrl', function ($scope, $rootScope, $interval, $timeout, $mdDialog, $mdBottomSheet, Client, socket, hotkeys) {
    var greetings = [
      'Сделай это расслышать, username!',
      'Гуф всё, username.',
      'Комнаты для слабаков, username!',
      'Будь мужиком, username! Ставь Укупника!',
      'Только 64kbps, username! Только хардкор!',
      'Чятик ждёт твой новый трек, username.',
      'username покинул нас.',
      'Нельзя просто взять и уйти из Триггера, username.',
      'Успей сходить за алкоголем до одиннадцати, username!',
      'Твой трек слишком длинный, username!',
      'Ложиться спать уже бесполезно, username.',
      'Не пытайтесь покинуть Trigger, username!',
      'Ты помнишь жизнь до Триггера, username?',
      'А у меня этот трек был на кассете, username. :)',
      '[removed]alert[removed], username!',
      'Я ДЖВА ГОДА ЖДАЛ ЭТОТ ТРЕК, username!',
      'Bird терпел и тебе велел, username!',
      'В хроме всё заливается, username!',
      'Ну и зачем ты так нажрался, username?',
      'Слушают, что дают, username.',
      'Здесь тебя научат материться по–арабски, username!',
      'Качает, username.',
      '–0–1:0–52, username.',
      'Эту песню написал Альберт Эйнштейн, username.',
      'Прописывай теги, username!',
      'Trigger нас не отпустит, username.',
      'Бёрд его знает, как этот Триггер работает, username.',
      'Включи морячка, username!',
      'Главная проблема музыки в России — это ты, username!',
      'Не обижай пони, username.',
      'Диско — бездушное говно, username!',
      'Только пост–хардкор, только хардкор, username!',
      'Ракамакафо, username!',
      'А ты тоже ждешь 80 порт как и я, username?',
      'Скэтмен круче Скутера, он его заборет, username.',
      'Триггер украл у нас Лепру, username!',
      'ПОЙДЕМ СО МНОЙ В ПРИВАТ, username!',
      'Всё лучше под дабстеп, username.',
      'Музыка нас связала, username.',
      'Что за направление сейчас играет, username?',
      'А у тебя сколько времени, username?',
      'Эй, username! Поставь мой компакт–диск!!!',
      'Танцполом правит ДОБРОТА, username!',
      'Это не \'ЧТО ЗА ГОВНО?\', а музыка, username.',
      'Trigger — первое радио, которое работает в метро, username!',
      'Не стоит принимать теглайны близко к сердцу, username. ;)',
      'Этот трек только для тебя, username!',
      'Здесь иногда бывают женщины, username.',
      'У меня одного не поёт, username?',
      'Моби ни в чём не виноват, username.',
      'Сейчас, ещё одна песня, и иду работать, username.',
      'Который раз ты уходишь спать, username?',
      'Обновляй страничку раз в 5–10 минут, пока не придёт помощь, username.',
      'Вот это ОХУЕННЫЙ ДЖАЗ, username!',
      'Хочешь много кармы? Поставь Beastie Boys, username!',
      'Сегодня ты просто слушатель, username!',
      'Вот щас моя песня сыграет — я твою СРАЗУ плюсую, username!',
      'Давно не слушали Pink Floyd, username, выручай!',
      'Гимн Советского Союза запрещено минусовать, username!',
      'А ты знаешь, кто получил первый инвайт, username?',
      'Сейчас играет музло из моих жигулей в 2005 году, username.',
      'Спаси, сохрани и открой любым плеером, username!',
      'Shut up and take my songs, username!',
      'Внезапно французский рэп, username. оО',
      'Попсу раз или в плейлист джаз, username?',
      'Позолоти трек, username.',
      'Тыц-тыц, username, унц-унц, username!',
      'НЕ ДАЙ ЭТОЙ ПЕСНЕ ДОИГРАТЬ ДО КОНЦА, username!',
      'Sepultura никогда не добиралась до эфира, username!',
      'Лей побольше кислоты, username!',
      'Мы поставляем Президентов Грузии с 1863 года, username.',
      'Эту песню сам Бог написал, username, и передал её чумовейшей группе, сука %^я Тайм!',
      'Заткнись и плюсуй! Тебе понравится, username!',
      'Поставь ещё того мягкого тупака, username.',
      'Я под неё в душе до сих пор танцую, username.',
      'Нам песня строить и жить помогает, username.',
      'Мы на кукинге, на свэге, на щегольстве, на карате, username!',
      'Триггер уже не тот, username!',
      'А ты уже на спорте, username?',
      'Мы подарим тебе музыкальные перехуки, username.',
      'Один вечер русского рока — ещё не конец, username.',
      'Get the mashup or die buried under the sisechki, username!',
      'Леонтьева лучше бензином заливать, username!',
      'С теглайнами не спорят, username!',
      'Я Триггер, я не хочу ничего решать, я хочу унц–унц, username.',
      'Буланова тоже плачет, username.',
      'username залил Unknown — Noname.',
      'Я под этот трек чик клеил, username!',
      '你好, username!',
      'На Бога надейся, а сам сри-сливай, username!',
      'У меня одного тупняк играет, или это у нас семейное, username?',
      'На любителя, конечно, но мне такое нравится, username.',
      'Большая карма — большая ответственность, username.',
      'Когда–то инвайт давали за +11, username.',
      'Я прослушал, давай ещё раз, username!',
      'Посиди на Триггере, пока не откроются магазины, username!',
      'Когда ты несёшь женщину в шляпе — это победа, username!',
      'Покорми кота, username!',
      'Нет радио, кроме Триггера, и username пророк его.',
      'Здесь спиды не залёживаются, username.',
      '♩ ♪ ♫ ♬ ☊.username.ιllιlι.ιl.',
      'Когда я вижу, как ты плюсуешь, username, ты меня волнуешь.',
      'ПОМНИ, username, У ТЕБЯ ЛИМИТ!',
      'Хоп хэй лалалэй, username!',
      'Прокрастинируешь, username?',
      'У тебя молоко убежало, username!',
      'Вышли инвайт боссу, username! Устрой себе отпуск!',
      'Too much ambient, username!',
      'Berry Weight — не Barry White, username!',
      'Не упоминай Боярского всуе, username!',
      'We don\'t need no education, username.',
      'Would you go to bed with me, username?',
      'Адажио Альбинони написал Ремо Джадзотто, username.',
      'Дождь прошёл — к Infected Mushroom, username.',
      'Минимальная длина трека — 35 см, username.',
      'Расскажи анекдот про басиста, username.',
      'Чем бы дитя ни тешилось, лишь бы не Скриллексом, username!',
      'Не пытайся перестать плакать, username!',
      'Семь раз послушай, один раз принеси, username!',
      'Не поминай Джонни Кэша всуе, username!',
      'Это энергичный танец, username!',
      'Люби женщин в карму, username!',
      'В случае опасности, заливай Айрон Мейден, username!',
      'Мы ведём вещание на средних и низких нечистотах, username!',
      'Музыка воодушевляет весь мир, снабжает душу крыльями, способствует полёту воображения, а ты продолжай ставить своего Укупника, username!',
      'Музыка должна быть остра, как клинки первой конной, username! %)',
      'Нечего лить - лей харп, username!',
      'Думджаз - для тех, кому блюз уже не поможет, username.',
      'Я не пидорас, но такое тащит, username! %)',
      'Не воруй моих детей, username!',
      'Не бери треки у наркоманов, username!',
      'Не всё то чилл, что уныло, username!',
      'Не весь метал одинаково полезен, username!',
      'Поиграй на контрастах, username!',
      'Начинай вводить, username!',
      'Всё было хорошо, пока на Триггер не пришёл username.',
      'Не обижай семплер, username!',
      'Эй, username, не хочешь немного Даргомыжского?',
      'У Джина Симмонса язык 12 сантиметров, а у username целых двадцать пять!',
      'Держись, username!',
      'думджаз - для тех, кому блюз уже не поможет, username',
      'Не отключайся, username!',
      'прекрасный альбом, username очень гашишный!',
      'Не всё, то чилл, что уныло, username!',
      'Не весь метал одинаково полезен, username!',
      'Пельмени каждый может обидеть, username!',
      'А теперь ешь своего аллигатора, username!',
      'нет, залить ты не сможешь, username!',
      'Боже, что ты несешь, username!',
      'Делаешь Дабстеп? Приходи к нам на завод записывать сэмплы, username!',
      'Как много треков тут хороших username, а плюсы тратим на попсу',
      'Музыка души - это не колебания волн и Скриллекс, username, а не спетая ещё песня жизни.',
      'Укради мне финскую барби, username!',
      'В любой непонятной ситуации гугли, username!',
      'Не отключайся, username!',
      'Это не баян, это ротация, username'
    ];


    $scope.users = {
      'listeners': 0,
      'active': 0
    };
    $scope.user = {
      'name': '%username%',
      'uplim': 0
    };
    var audio = document.getElementById('audio');
    $scope.volume = 50;
    if (localStorage.getItem('volume') > -1) {
      $scope.volume = localStorage.getItem('volume');
    } else {
      localStorage.setItem('volume', $scope.volume);
    }
    $scope.changeVolume = function(volume) {
      localStorage.setItem('volume', volume);
      audio.volume = volume/100;
    };

    hotkeys.bindTo($scope)
    .add({
      combo: 'shift+left',
      description: 'Volume -1',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume <= 1) {
          $scope.changeVolume(0);
          $scope.volume = 0;
        } else {
          $scope.changeVolume($scope.volume - 1);
          $scope.volume -= 1;
        }
      }
    })
    .add({
      combo: 'shift+right',
      description: 'Volume +1',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume >= 99) {
          $scope.changeVolume(100);
          $scope.volume = 100;
        } else {
          $scope.changeVolume($scope.volume + 1);
          $scope.volume += 1;
        }
      }
    })
    .add({
      combo: 'alt+left',
      description: 'Volume -5',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume <= 5) {
          $scope.changeVolume(0);
          $scope.volume = 0;
        } else {
          $scope.changeVolume($scope.volume - 5);
          $scope.volume -= 5;
        }
      }
    })
    .add({
      combo: 'alt+right',
      description: 'Volume +5',
      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
      callback: function() {
        if ($scope.volume >= 95) {
          $scope.changeVolume(100);
          $scope.volume = 100;
        } else {
          $scope.changeVolume($scope.volume + 5);
          $scope.volume += 5;
        }
      }
    })
    ;


    $scope.greeting = greetings[Math.floor(Math.random() * greetings.length)].replace('username', $scope.user.name);
    $interval(function(){
      $scope.greeting = greetings[Math.floor(Math.random() * greetings.length)].replace('username', $scope.user.name);
    },9000);

    $scope.$watch(function() {
      return $rootScope.load.welcome;
    }, function() {
      if ($rootScope.load.welcome === true) {
        $scope.users.listeners = Client.channel.lst;
        $scope.users.active = Client.channel.a;
        socket.on('lst', function(data) {
          $scope.users.listeners = data.l;
          $scope.users.active = data.a;
        });
      }
      $scope.load.welcome = $rootScope.load.welcome;
    }, true);

    $scope.$watch(function() {
      return $rootScope.load.signed;
    }, function() {
      if ($rootScope.load.signed === true) {
//        console.log('Client.user', Client.user);
        $scope.user.name = Client.user.n;
        $scope.user.uplim = Client.user.t;
        socket.on('uplim', function(data) {
          $scope.user.uplim = data.t;
        });
      }
      $scope.load.signed = $rootScope.load.signed;
    }, true);

    $scope.data = function() {
      console.log('data', Client);
    };

    $scope.showLoginModal = function(ev) {
      $mdDialog.show({
        controller: LoginCtrl,
        templateUrl: 'components/login/login.html',
        targetEvent: ev,
      });
    };

    $scope.logout = function() {
      Client.logout(
        function() {
          if (localStorage.getItem('password') != '') {
            localStorage.removeItem('password');
            localStorage.removeItem('username');
          }
          $rootScope.load.signed = false;
          $route.reload();
        }
      );
    }

    function LoginCtrl($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
    }
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
