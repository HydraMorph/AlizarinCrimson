'use strict';

var app = angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io']);

app.value('nickName', 'true');
app.value('password', '09e7881117ecd5e66723322ef5a6f4e0');

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.ngEnter, {'event': event});
        });
        event.preventDefault();
      }
    });
  };
});

app.run(function ($rootScope, Client) {
  $rootScope.load = {
    'signed': false,
    'welcome': false,
    'playlist': false
  };
  $rootScope.title = "Trigger";
  $rootScope.userId = 0;
  Client.init(location.host);
  $(Client).bind('welcome', function(event, data) {
    Client.channel = data.channels[0];
    Client.getChannels(function(data){
      Client.channels = data.channels;
      console.log(data);
    });
//    $rootScope.client.channel = data.channels[0];
    Client.goChannel(1, console.log('Q' ,data));
    console.log('welcome', Client.channel);
    $rootScope.load.welcome = true;
  });
  $rootScope.client = Client;
});


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
      })
    }
  };
});


app.service('Client', function ($log) {
  this.version = 2205;
  this.user = null;
  this.channel = {};
  this.callbacks = {};
  this.chat = null;
  this.trackscache = [];
  this.include = function(ctrl) {
    console.log('include ' + ctrl);
  }
  this.init = function (host) {
    console.log('init');
    this.socket = io('http://trigger.fm');
    var socket = this.socket;
    var cl = this;

    socket.on('welcome', function (data) {
      $(cl).trigger('welcome', data);
    });

    socket.on('getver', function () {
      socket.emit('ver', {'v': cl.version, 'init': true});
    });

    socket.on('addtrack', function(data) {
      data.track.src = 'img/nocover.png';
      var track = data.track;
      track.vote = 0;
      if (cl.user) {
        for (var v in track.n) {
          if (track.n[v].vid == cl.user.id) {
            track.vote = track.n[v].v;
            break;
          }
        }
        for (var v in track.p) {
          if (track.p[v].vid === cl.user.id) {
            track.vote = track.p[v].v;
            break;
          }
        }
      }
      cl.channel.pls.push(track);
//      cl.channel.pls.sort(sortFunction);
      $(cl).trigger('addtrack', data);
//      getcover(track.a, track.t, function(src) {
//        track.src = src;
//        $(cl).trigger('cover', {id: data.track.id, 'src': src});
//      });
    });

    socket.on('removetrack', function(data) {
      for (var t in cl.channel.pls) {
        if (cl.channel.pls[t].id === data.tid) {
          data.track = cl.channel.pls[t];
          $(cl).trigger('removetrack', data);
          cl.channel.pls.splice(t, 1);
          break;
        }
      }
    });

    socket.on('newcurrent', function(data) {
      if (data.chid === cl.channel.chid) {
        for (var tr in cl.channel.pls) {
          if (cl.channel.pls[tr].id === data.track.id) {
            data.track.src = cl.channel.pls[tr].src;
            data.track.vote = cl.channel.pls[tr].vote;
            cl.channel.pls.splice(tr, 1);
            break;
          }
        }
        cl.channel.current = data.track;
        cl.channel.ct = 0;
      }
      $(cl).trigger('newcurrent', data);
      $(cl).trigger('removetrack', data);
    });

    socket.on('lst', function(data) {
      for (var i in cl.channels) {
        if (data.chid == cl.channels[i].id) {
          cl.channels[i].lst = data.l;
        }
      }
      if (data.chid == cl.channel.chid) {
        cl.channel.lst = data.l;
        cl.channel.a = data.a;
      }
      $(cl).trigger('listners', data);
    });

    socket.on('usupd', function(data) {
//      if (cl.chat) {
//        for (var us in cl.chat.u) {
//          if (cl.chat.u[us].id == data.uid) {
//            cl.chat.u[us].a = data.a;
//          }
//        }
        $(cl).trigger('userupdate', data);
//      }
    });

    socket.on('uplim', function(data) {
      if (data.nt > 0) {
        cl.user.nt = new Date(Date.parse(new Date()) + data.nt);
      } else {
        if (cl.user) {
          cl.user.nt = 0;
        }
      }
      cl.user.t = data.t;
      if (cl.user.t < 0) {
        cl.user.t = 0;
      }
      cl.user.w = data.w;
      $(cl).trigger('updatelimits', data);
    });

    socket.on('channeldata', function(data) {
      var i = 0;
      var gg = function() {
        var tr = cl.channel.pls[i];
//        getcover(tr.a, tr.t, function(src) {
//          tr.src = src;
//          $(cl).trigger('cover', {id: tr.id, 'src': src});
//          i += 1;
//          if (i < cl.channel.pls.length) {
//            gg();
//          }
//        });
      };
      data.changed = true;
//      data.hi = streampath + data.hi;
//      data.low = streampath + data.low;
      data.hi = data.hi;
      data.low = data.low;
      cl.channel = data;
      var track = cl.channel.current;
      if (track) {
        track.vote = 0;
        if (cl.user) {
          for (var v in track.n) {
            if (track.n[v].vid == cl.user.id) {
              track.vote = track.n[v].v;
              break;
            }
          }
          for (var v in track.p) {
            if (track.p[v].vid == cl.user.id) {
              track.vote = track.p[v].v;
              break;
            }
          }
        }
      }
      for (var t in cl.channel.pls) {
        var track = cl.channel.pls[t];
        if (track) {
          track.vote = 0;
          if (cl.user) {
            for (var v in track.n) {
              if (track.n[v].vid == cl.user.id) {
                track.vote = track.n[v].v;
                break;
              }
            }
            for (var v in track.p) {
              if (track.p[v].vid == cl.user.id) {
                track.vote = track.p[v].v;
                break;
              }
            }
          }
        }
      }
//      cl.callbacks.channeldata(data);
//      getcover(data.current.a, data.current.t, function(src) {
//        data.current.src = src;
//        $(cl).trigger('cover', {id: data.current.id, 'src': src});
//      });
//      cl.callbacks.channeldata(cl.channel);
//      if (cl.channel.pls.length > 0) {
//        gg();
//      }
    });

    socket.on('message', function(data) {
//      cl.chat.m.push(data);
      $(cl).trigger('message', data);
    });

    socket.on('history', function(data) {
      cl.callbacks.history(data);
    });

    socket.on('channelsdata', function(data) {
      cl.channels = data.channels;
      cl.callbacks.channelsdata(data);
    });

    socket.on('userdata', function(data) {
      console.log(data);
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

    socket.on('banned', function(data) {
      $(cl).trigger('banned', data);
    });

    socket.on('newuser', function(data) {
//      if (cl.chat) {
//        var user = {
//          id: data.uid,
//          n: data.n,
//          a: data.a
//        };
//        cl.chat.u.push(user);
        $(cl).trigger('newuser', data);
//      }
    });

    socket.on('offuser', function(data) {
//      if (cl.chat) {
//        for (var us in cl.chat.u) {
//          if (cl.chat.u[us].id == data.uid) {
//            cl.chat.u.splice(us, 1);
//          }
//        }
        $(cl).trigger('offuser', data);
//      }
    });

    socket.on('playlist', function(data) {
      cl.callbacks.playlist(data);
    });

    socket.on('loginstatus', function(data) {
      if (data.error) {
        var message = '';
        if (data.error == 'nouser') {
          data.error = 'Нет такого пользователя';
        }
        if (data.error == 'wrongpass') {
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
      $(cl).trigger('disconnect');
      cl.user = null;
      cl.channel = {};
      cl.callbacks = {};
      cl.chat = null;
    });

    socket.on('tags', function(data) {
      cl.callbacks.tags(data.t);
    });

    socket.on('uptr', function(data) {
//      if (data.t.id == cl.channel.current.id) {
//        var src = cl.channel.current.src;
//        cl.channel.current = data.t;
//        cl.channel.current.scr = src;
//        var track = cl.channel.current;
//        track.vote = 0;
//        for (var v in track.n) {
//          if (track.n[v].vid == cl.user.id) {
//            track.vote = track.n[v].v;
//            break;
//          }
//        }
//        for (var v in track.p) {
//          if (track.p[v].vid == cl.user.id) {
//            track.vote = track.p[v].v;
//            break;
//          }
//        }
//        data.current = true;
//      } else {
//        for (var t in cl.channel.pls) {
//          if (cl.channel.pls[t].id == data.t.id) {
//            cl.channel.pls[t] = data.t;
//            var track = cl.channel.pls[t];
//            track.vote = 0;
//            for (var v in track.n) {
//              if (track.n[v].vid == cl.user.id) {
//                track.vote = track.n[v].v;
//                break;
//              }
//            }
//            for (var v in track.p) {
//              if (track.p[v].vid == cl.user.id) {
//                track.vote = track.p[v].v;
//                break;
//              }
//            }
////            cl.channel.pls.sort(sortFunction);
//            data.current = false;
//            break;
//          }
//        }
//      }
      $(cl).trigger('trackupdate', data);
    });
  };

  this.login = function(name, pass, callback) {
    var cl = this;
    cl.callbacks.loginstatus = callback;
    this.socket.emit('login', {u: name, p: pass});
  };

  this.track = function(id, callback) {
    var cl = this;
    var complete=false;
    if (id == cl.channel.current.id) {
      if (callback) {
        callback(cl.channel.current);
        complete=true;
      } else {
        return cl.channel.current;
      }
    }
    for (var t in cl.channel.pls) {
      if (cl.channel.pls[t].id == id) {
        if (callback) {
          callback(cl.channel.pls[t]);
          complete=true;
        } else {
          return cl.channel.pls[t];
        }
      }
    }
    if (!complete&&callback){
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

  this.getChat = function(data, callback) {
    var cl = this;
    this.socket.emit('getchat', {'shift': data.shift, 'id': this.channel.chid}, function(data) {
      if (data.u) {
        cl.chat = data;
        cl.chat.id = cl.channel.chid;
      }
      callback(data);
    });
  };

  this.sendMessage = function(message, callback) {
    var data = {'m': message};
    this.socket.emit('sendmessage', data, callback);
  };

  this.tracksubmit = function(data, callback) {
    var form = data.form;
    this.socket.emit('tracksubmit', {'chid': this.channel.chid, 'track': data.track}, function(data) {
      data.form = form;
      console.log('data.form: ', data.form);
      callback(data);
    });
  };

  this.addvote = function(data, callback) {
    if (this.user) {
      data.chid = this.channel.chid;
      this.socket.emit('vote', data);
    }
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

  this.getHistory = function(shift, gold, callback) {
    this.callbacks.history = callback;
    this.socket.emit('gethistory', {chid: this.channel.chid, s: shift, g: gold});
  };

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
    cl = this;
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
      if (this.channels[i].id == id) {
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

//app.factory('Client', function() {
//  var Client = function () {
//    this.version = 2205;
//    this.user = null;
//    this.channel = {}
//    this.callbacks = {};
//    this.chat = null;
//    this.trackscache = [];
//  }
//  this.init = function() {
//    console.log('init');
//    this.socket=io('http://trigger.fm');
//    var socket=this.socket;
//    var cl = this;
//    socket.on('welcome', function(data) {
//      $(cl).trigger('welcome', data);
//    });
//    socket.on('getver', function() {
//      socket.emit('ver', {'v': cl.version, 'init': true});
//    });
//    socket.on('loginstatus', function(data) {
//      if (data.error) {
//        var message = '';
//        if (data.error == 'nouser') {
//          data.error = 'Нет такого пользователя';
//        }
//        if (data.error == 'wrongpass') {
//          data.error = 'Не тот пароль';
//        }
//      } else {
//        cl.user = data.user;
//        if (cl.user.t < 0) {
//          cl.user.t = 0;
//        }
//        cl.user.nt = new Date(Date.parse(new Date()) + cl.user.nt);
//      }
//      cl.callbacks.loginstatus(data);
//    });
//  }
//  return Client;
//});

app.factory('md5', function() {
  var md5 = {
    createHash: function(str) {
      var xl;
      var rotateLeft = function(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
      };
      var addUnsigned = function(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
          return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
          if (lResult & 0x40000000) {
            return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
          } else {
            return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
          }
        } else {
          return (lResult ^ lX8 ^ lY8);
        }
      };
      var _F = function(x, y, z) {
        return (x & y) | ((~x) & z);
      };
      var _G = function(x, y, z) {
        return (x & z) | (y & (~z));
      };
      var _H = function(x, y, z) {
        return (x ^ y ^ z);
      };
      var _I = function(x, y, z) {
        return (y ^ (x | (~z)));
      };
      var _FF = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      var _GG = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      var _HH = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      var _II = function(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
      };
      var convertToWordArray = function(str) {
        var lWordCount;
        var lMessageLength = str.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = new Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
          lWordCount = (lByteCount - (lByteCount % 4)) / 4;
          lBytePosition = (lByteCount % 4) * 8;
          lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
          lByteCount += 1;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
      };
      var wordToHex = function(lValue) {
        var wordToHexValue = '',
          wordToHexValue_temp = '',
          lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount += 1) {
          lByte = (lValue >>> (lCount * 8)) & 255;
          wordToHexValue_temp = '0' + lByte.toString(16);
          wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
        }
        return wordToHexValue;
      };
      var x = [],
        k, AA, BB, CC, DD, a, b, c, d, S11 = 7,
        S12 = 12,
        S13 = 17,
        S14 = 22,
        S21 = 5,
        S22 = 9,
        S23 = 14,
        S24 = 20,
        S31 = 4,
        S32 = 11,
        S33 = 16,
        S34 = 23,
        S41 = 6,
        S42 = 10,
        S43 = 15,
        S44 = 21;

      //str = this.utf8_encode(str);
      x = convertToWordArray(str);
      a = 0x67452301;
      b = 0xEFCDAB89;
      c = 0x98BADCFE;
      d = 0x10325476;

      xl = x.length;
      for (k = 0; k < xl; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
      }
      var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
      return temp.toLowerCase();
    }
  };
  return md5;
});
