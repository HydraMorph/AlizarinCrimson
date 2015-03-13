'use strict';

var app = angular.module('trigger', ['angular-loading-bar', 'ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io', 'luegg.directives', 'angularMoment', 'ngMdIcons', 'cfp.hotkeys', 'vs-repeat', 'pascalprecht.translate', 'react']);

/* Angular material theme */
app
  .config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('orange');
  })
  /* angular-loading-bar style */
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }]);

/* angularMoment locale */
app.run(function(amMoment) {
  amMoment.changeLocale('ru');
});

//app.constant('angularMomentConfig', {
//  preprocess: 'unix', // optional
//  timezone: 'Europe/London' // optional
//});

/* ng-enter */
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown keypress', function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });
        event.preventDefault();
      }
    });
  };
});

/* Sockets support */
app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://trigger.fm');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});


app.run(function ($rootScope, Client, socket) {

  /* init */
  $rootScope.load = {
    'signed': false,
    'welcome': false,
    'playlist': false
  };

  /* login callback */
  function processLogin (data) {
    if (data.error) {
      console.log(data.error);
    } else {
      Client.user = data.user;
      $rootScope.userId = data.user.id;
      $rootScope.load.signed = true;
    }
  }
  var u = localStorage.getItem('username');
  var p = localStorage.getItem('password');

  $rootScope.title = 'Trigger';
  $rootScope.userId = 0;
  Client.init(location.host); /* Init Client */

  /* Get first data - channel, users, playlist*/
  socket.on('welcome', function (data) {
    Client.channel = data.channels[0];
    Client.getChannels(function(data){
      Client.channels = data.channels;
      if (u !== undefined && p !== undefined) {
        Client.login(u, p, processLogin);
      }
    });
    Client.goChannel(1, console.log('Q' ,data));
    $rootScope.load.welcome = true;
  });

  $rootScope.client = Client;
});

app.service('Client', function ($log) {
  this.version = 2205;
  this.user = null;
  this.channel = {};
  this.callbacks = {};
  this.chat = null;
  this.trackscache = [];
  this.init = function (host) {
    console.log('init');
    this.socket = io('http://trigger.fm');
    var socket = this.socket;
    var cl = this;

    socket.on('getver', function () {
      socket.emit('ver', {'v': cl.version, 'init': true});
    });

    socket.on('channeldata', function(data) {
//      console.log('channeldata', data);
    });

    socket.on('history', function(data) {
      cl.callbacks.history(data);
    });

    socket.on('channelsdata', function(data) {
      cl.channels = data.channels;
      cl.callbacks.channelsdata(data);
    });

    socket.on('userdata', function(data) {
      cl.callbacks.userdata(data);
    });

    socket.on('uvd', function(data) {
      cl.callbacks.uvotedata(data);
    });

    socket.on('invitestatus', function(data) {
      cl.callbacks.invitestatus(data);
    });

    socket.on('recoverstatus', function(data) {
      cl.callbacks.recover(data);
    });

    socket.on('changepass', function(data) {
      cl.callbacks.changepass(data);
    });

//    socket.on('banned', function(data) {
//      $(cl).trigger('banned', data);
//    });

    socket.on('playlist', function(data) {
      cl.callbacks.playlist(data);
    });

    socket.on('loginstatus', function(data) {
      if (data.error) {
        var message = '';
        if (data.error === 'nouser') {
          data.error = 'Нет такого пользователя';
        }
        if (data.error === 'wrongpass') {
          data.error = 'Не тот пароль';
        }
      } else {
        cl.user = data.user;
        if (cl.user.t < 0) {
          cl.user.t = 0;
        }
        cl.user.nt = new Date(Date.parse(new Date()) + cl.user.nt);
      }
      cl.callbacks.loginstatus(data);
    });

    socket.on('disconnect', function(data) {
//      $(cl).trigger('disconnect');
      cl.user = null;
      cl.channel = {};
      cl.callbacks = {};
      cl.chat = null;
    });

    socket.on('tags', function(data) {
      cl.callbacks.tags(data.t);
    });

  };

  this.login = function(name, pass, callback) {
    var cl = this;
    cl.callbacks.loginstatus = callback;
    this.socket.emit('login', {u: name, p: pass});
  };

  this.track = function(id, callback) {
    var cl = this;
    var complete = false;
    if (id === cl.channel.current.id) {
      if (callback) {
        callback(cl.channel.current);
        complete = true;
      } else {
        return cl.channel.current;
      }
    }
    for (var t in cl.channel.pls) {
      if (cl.channel.pls[t].id === id) {
        if (callback) {
          callback(cl.channel.pls[t]);
          complete = true;
        } else {
          return cl.channel.pls[t];
        }
      }
    }
    if (!complete && callback){
      this.socket.emit('gettrack', {'id': id}, function(d) {
        callback(d);
      });
    }
  };

  this.getPlaylist = function(channel, callback) {
    cl = this;
    cl.callbacks.playlist = callback;
    this.socket.emit('getplaylist', {id: channel});
  };

  this.goChannel = function(channel, callback) {
    var cl = this;
    cl.callbacks.channeldata = callback;
    this.socket.emit('gochannel', {id: channel});
  };

  this.getChannels = function(callback) {
    var cl = this;
    cl.callbacks.channelsdata = callback;
    this.socket.emit('getchannels');
  };

  this.tracksubmit = function(data, callback) {
    var form = data.form;
    this.socket.emit('tracksubmit', {'chid': this.channel.id, 'track': data.track}, function(data) {
      data.form = form;
      console.log('data.form: ', data.form);
      callback(data);
    });
  };

  this.adduservote = function(data, callback) {
    if (this.user) {
      this.callbacks.uvotedata = callback;
      this.socket.emit('uvote', data);
    }
  };

  this.getUser = function(data, callback) {
    this.socket.emit('getuser', data, callback);
  };

//  this.getHistory = function(data, callback) {
//    console.log(data);
//    this.socket.emit('gethistory', {
//      chid: 1,
//      s: data.shift,
//      a: data.artist,
//      t: data.title,
//      top: data.top,
//      g: data.gold
//    }, callback);
//  };
//  this.getHistory = function(shift, gold, callback) {
//    this.callbacks.history = callback;
//    this.socket.emit('gethistory', {id: this.channel.id, s: shift, g: gold});
//  };

  this.getTags = function(str, callback) {
    cl = this;
    cl.callbacks.tags = callback;
    this.socket.emit('gettags', {s: str});
  };

  this.getTrackTags = function(artist, title, callback) {
    cl = this;
    cl.callbacks.tags = callback;
    this.socket.emit('gettags', {a: artist, t: title});
  };

  this.addTag = function(str, callback) {
    cl = this;
    cl.callbacks.tags = callback;
    this.socket.emit('addtag', {s: str});
  };

  this.killtrack = function(track) {
    cl = this;
    this.socket.emit('deltrack', {tid: track, chid: cl.channel.chid});
  };

  this.sendinvite = function(mail, code, callback) {
    cl = this;
    cl.callbacks.invitestatus = callback;
    this.socket.emit('sendinvite', {m: mail, c: code});
  };

  this.sendextinvite = function(data, callback) {
    this.socket.emit('sendextinvite', data, callback);
  };

  this.logout = function(callback) {
    this.socket.emit('logout', {s: true}, callback);
  };

  this.recover = function(mail, callback) {
    cl = this;
    cl.callbacks.recover = callback;
    this.socket.emit('recover', {m: mail});
  };

  this.changepass = function(oldpass, newpass, callback) {
    var cl = this;
    cl.callbacks.changepass = callback;
    this.socket.emit('changepass', {o: oldpass, n: newpass});
  };

  this.updateUserData = function(data) {
    this.socket.emit('upduserdata', data);
  };

  this.updateTrack = function(data) {
    this.socket.emit('updtrack', data);
  };

  this.getchannel = function(id) {
    for (var i in this.channels) {
      if (this.channels[i].id === id) {
        return this.channels[i];
      }
    }
    return false;
  };

  this.banuser = function(uid, reason, callback) {
    console.log(reason);
    this.socket.emit('banuser', {id: uid, r: reason}, callback);
  };

  this.unbanuser = function(uid, callback) {
    this.socket.emit('unbanuser', {id: uid}, callback);
  };

  this.setop = function(d, callback) {
    this.socket.emit('setop', d, callback);
  };

  this.removeop = function(data, callback) {
    this.socket.emit('removeop', data, callback);
  };

  this.setprops = function(data, callback) {
    this.socket.emit('setprops', data, callback);
  };

  this.sendPRVote = function(data, callback) {
    this.socket.emit('prvote', data, callback);
  };
});


app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', {
    /* Login */
    'loginUsername': 'Username',
    'loginPassword': 'Password',
    'loginSubmit': 'Yarrr!',
    /* Console */
    'consoleLogIn': 'Log in',
    'consoleListeners': 'Listeners',
    'consoleActiveUsers': 'Active users',
    'consoleYouCanUpload': 'You can upload',
    'consoleDonateMe': 'Donate',
    'consoleChangeTheme': 'Change theme',
    'consoleRTFM': 'RTFM',
    'consoleLogOut': 'Log out',
    /* Info */
    'infoTabChat': 'Chat',
    'infoTabHistory': 'History',
    'infoTabDemocracy': 'Democracy',
    'infoTabProfile': 'Profile',
    /* Democracy */
    'democracyElections': 'Elections',
    'democracyCandidate': 'Candidate ID',
    'democracyVoted': 'You voted for',
    'democracyVote': 'Vote',
    'democracyTabModer': 'Moder',
    'democracyTabBlog': 'Blogs',
    /* Chat */
    'startTyping': 'type your message here...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'tink',
    'chatImg': 'images',
    /* Online */
    'onlineHere':'Here',
    /* History */
    'historyGold': 'gold',
    'historyArtist': 'Artist',
    'historyTitle': 'Title',
    'historyNoResults': 'No results ):',
    /* Playlist */
    'trackUploadedBy': 'uploaded by ',
    'trackToChat': 'send to chat',
    /* Profile */
    'profileUser': 'User',
    'profileUploads': 'Uploads',
    'profilePluses': 'Pluses',
    'profileMinuses': 'Minuses',
    'profileSettings': 'Settings',
    /* User */
    'userBan': 'Ban',
    'userIgnore' :'Ignore',
    'userInvitedBy' :'Invited by',
    'userInvite': 'Invited',
    'userRegDate' :'Registered',
    /* Settings */
    'settingsLogOut': 'Log out',
    'settingsTink': 'Tink',
    'settingsImg': 'Show images',
    'settingsFemale': 'Yahooo! I am woman',
    'settingsOldPassword': 'Old password',
    'settingsNewPassword': 'New password',
    'settingsNewPasswordAgain': 'Type new password again',
    'settingsNewPasswordSumbit': 'Change password!'
  });
  $translateProvider.translations('ru', {
    /* Login */
    'loginUsername': 'Логин',
    'loginPassword': 'Пароль',
    'loginSubmit': 'Трям!',
    /* Console */
    'consoleLogIn': 'Войти',
    'consoleListeners': 'Слушают',
    'consoleActiveUsers': 'из них активно',
    'consoleYouCanUpload': 'Ты можешь залить',
    'consoleDonateMe': 'Жертвенник',
    'consoleChangeTheme': 'Сделать день',
    'consoleRTFM': 'Мануал',
    'consoleLogOut': 'Выйти',
    /* Info */
    'infoTabChat': 'Чат',
    'infoTabHistory': 'История',
    'infoTabDemocracy': 'Демократия',
    'infoTabProfile': 'Профиль',
    /* Democracy */
    'democracyElections': 'Выборы',
    'democracyCandidate': 'ID кандидата',
    'democracyVoted': 'Ты проголосовал за',
    'democracyVote': 'Голосовать',
    'democracyTabModer': 'Модер',
    'democracyTabBlog': 'Блоги',
    /* Chat */
    'startTyping': 'начинай вводить...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'тиньк',
    'chatImg': 'картинки',
    /* Online */
    'onlineHere':'Здесь',
    /* History */
    'historyGold': 'Золото',
    'historyArtist': 'Исполнитель',
    'historyTitle': 'Трек',
    'historyNoResults': 'Нет результатов',
    /* Playlist */
    'trackUploadedBy': 'прнс',
    'trackToChat': 'в чат',
    /* Profile */
    'profileUser': 'Юзер',
    'profileUploads': 'Загрузки',
    'profilePluses': 'Плюсы',
    'profileMinuses': 'Минусы',
    'profileSettings': 'Настройки',
    /* User */
    'userBan': 'Забанить',
    'userIgnore' :'ОМММ',
    'userInvitedBy' :'По приглашению',
    'userInvite': 'Понаприглашал',
    'userRegDate' :'С нами с',
    /* Settings */
    'settingsLogOut': 'Выйти',
    'settingsTink': 'Тинькать',
    'settingsImg': 'Показывать картинки',
    'settingsFemale': 'Ура, я женщина!',
    'settingsOldPassword': 'Старый пароль',
    'settingsNewPassword': 'Новый пароль',
    'settingsNewPasswordAgain': 'Новый пароль еще раз',
    'settingsNewPasswordSumbit': 'Я понимаю что делаю!'
  });

  $translateProvider.translations('he', {
    /* Login */
    'loginUsername': 'שם משתמש',
    'loginPassword': 'סיסמא',
    'loginSubmit': 'שלח!',
    /* Console */
    'consoleLogIn': 'התחבר',
    'consoleListeners': 'מאזינים',
    'consoleActiveUsers': 'משתמשים פעילים',
    'consoleYouCanUpload': 'אתה כרגע יכול להעלות ',
    'consoleDonateMe': 'לתרום לפיתוח',
    'consoleChangeTheme': 'שנה ',
    'consoleRTFM': 'RTFM',
    'consoleLogOut': 'צא',
    /* Info */
    'infoTabChat': 'צ\'אט',
    'infoTabHistory': 'היסטוריה',
    'infoTabDemocracy': 'דמוקרטיה',
    'infoTabProfile': 'פרופיל',
    /* Democracy */
    'democracyElections': 'בחירות',
    'democracyCandidate': 'ID המועמד',
    'democracyVoted': 'בחרתם ב',
    'democracyVote': 'בחר',
    'democracyTabModer': 'מנהל',
    'democracyTabBlog': 'בלוג',
    /* Chat */
    'startTyping': 'תרשום פה...',
    'chatBold': 'bold',
    'chatIrony': 'irony',
    'chatTink': 'צליל התראה',
    'chatImg': 'תמונות',
    /* Online */
    'onlineHere':'פה כרגע',
    /* History */
    'historyGold': 'זהב',
    'historyArtist': 'שם האומן',
    'historyTitle': 'שם הטראק',
    'historyNoResults': 'אין תוצאות ):',
    /* Playlist */
    'trackUploadedBy': 'הועלה ע"י" ',
    'trackToChat': 'שלח לצ\'אט',
    /* Profile */
    'profileUser': 'שם משתמש',
    'profileUploads': 'העלאות',
    'profilePluses': 'חיוביים',
    'profileMinuses': 'שליליים',
    'profileSettings': 'הגדרות',
    /* User */
    'userBan': 'חסום',
    'userIgnore' :'התעלם',
    'userInvitedBy' :'הוזמן ע"י"',
    'userInvite': 'הוזמן',
    'userRegDate' :'רשום',
    /* Settings */
    'settingsLogOut': 'צא',
    'settingsTink': 'צליל התראה',
    'settingsImg': 'תראה תמונות',
    'settingsFemale': 'יששש! אני בחורה',
    'settingsOldPassword': 'סיסמא ישנה',
    'settingsNewPassword': 'סיסמא חדשה',
    'settingsNewPasswordAgain': 'עוד הפעם , סיסמא חדשה',
    'settingsNewPasswordSumbit': 'שנה סיסמא!'
  });

  $translateProvider.registerAvailableLanguageKeys(['en', 'ru'], {
    'en_US': 'en',
    'en_UK': 'en',
    'ru_RU': 'ru'
  })

// Determining preferred language automatically
//  $translateProvider.determinePreferredLanguage();

  $translateProvider.preferredLanguage('he');
  $translateProvider.fallbackLanguage('en');
}]);
