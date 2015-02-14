'use strict';

var app = angular.module('trigger', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMaterial', 'btford.socket-io', 'react', 'ngAudio']);

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

var CURRENT = React.createClass({displayName: 'CURRENT',
  render: function() {
    var tags = this.props.data.tg;
    var nodes = "";
    if (tags != undefined) {
      var nodes = tags.map(function(tag) {
        return React.createElement("span", {className: "track__tag"}, tag.n);
      });
    }
    return (React.createElement("div", {className: "playlist__track"},
      React.createElement("div", {className: "track__img-cont"},
        React.createElement("img", {"ng-src": "", className: "track__img", alt: ""})
      ),
      React.createElement("div", {className: "track__content"},
        React.createElement("h3", {className: "track__artist"}, this.props.data.a),
        React.createElement("h4", {className: "track__title"}, this.props.data.t)
      ),
      React.createElement("div", {className: "track__tags"}, nodes),
      React.createElement("div", {className: "track__votes-block"},
        React.createElement("md-button", {className: "md-fab track__vote--down", "aria-label": "track-up", "ng-click": "voteDown()"},
          React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"},
            React.createElement("path", {d: "M16.59 8.59l-4.59 4.58-4.59-4.58-1.41 1.41 6 6 6-6z"}),
            React.createElement("path", {d: "M0 0h24v24h-24z", fill: "none"})
          )
        ),
        React.createElement("span", {className: "track__rating"}, this.props.data.r),
        React.createElement("md-button", {className: "md-fab track__vote--up", "aria-label": "track-down", "ng-click": "voteUp()"},
          React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"},
            React.createElement("path", {d: "M12 8l-6 6 1.41 1.41 4.59-4.58 4.59 4.58 1.41-1.41z"}),
            React.createElement("path", {d: "M0 0h24v24h-24z", fill: "none"})
          )
        )
      )
    ));
  }
});
app.value('CURRENT', CURRENT);

var TRIGGERPLAYLIST = React.createClass({displayName: 'TRIGGERPLAYLIST',
  render: function() {
    var tracks = this.props.data;
    var nodes = "";
    if (tracks != undefined) {
      var nodes = tracks.map(function(track) {
        var tags = track.tg;
        var tagsnodes = "";
        if (tags != undefined) {
          var tagsnodes = tags.map(function(tag) {
            return React.createElement("span", {className: "track__tag"}, tag.n);
          });
        }
        return React.createElement("md-item", {className: "playlist__track"},
          React.createElement("div", {className: "track__img-cont"},
            React.createElement("img", {"ng-src": "", className: "track__img", alt: ""})
          ),
          React.createElement("div", {className: "track__content"},
            React.createElement("h3", {className: "track__artist"}, track.a),
            React.createElement("h4", {className: "track__title"}, track.t)
          ),
          React.createElement("div", {className: "track__tags"}, tagsnodes),
          React.createElement("div", {className: "track__votes-block"},
            React.createElement("md-button", {className: "md-fab track__vote--down", "aria-label": "track-up", "ng-click": "voteDown()"},
              React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"},
                React.createElement("path", {d: "M16.59 8.59l-4.59 4.58-4.59-4.58-1.41 1.41 6 6 6-6z"}),
                React.createElement("path", {d: "M0 0h24v24h-24z", fill: "none"})
              )
            ),
            React.createElement("span", {className: "track__rating"}, track.r),
            React.createElement("md-button", {className: "md-fab track__vote--up", "aria-label": "track-down", "ng-click": "voteUp()"},
              React.createElement("svg", {xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24"},
                React.createElement("path", {d: "M12 8l-6 6 1.41 1.41 4.59-4.58 4.59 4.58 1.41-1.41z"}),
                React.createElement("path", {d: "M0 0h24v24h-24z", fill: "none"})
              )
            )
          )
        );
      });
    }
    return (React.createElement("md-list", {className: "playlist__list"}, nodes));
  }
});
app.value('TRIGGERPLAYLIST', TRIGGERPLAYLIST);

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


app.run(function ($rootScope, Client) {
  $rootScope.load = {
    'signed': false,
    'welcome': false,
    'playlist': false
  };
  $rootScope.title = 'Trigger';
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
      $(cl).trigger('addtrack', track);
    });

    socket.on('removetrack', function(data) {
      $(cl).trigger('removetrack', data);
    });

    socket.on('newcurrent', function(data) {
      $(cl).trigger('newcurrent', data);
      $(cl).trigger('removetrack', data);
    });

    socket.on('lst', function(data) {
      $(cl).trigger('listners', data);
    });

    socket.on('usupd', function(data) {
      $(cl).trigger('userupdate', data);
    });

    socket.on('uplim', function(data) {
      $(cl).trigger('updatelimits', data);
    });

    socket.on('channeldata', function(data) {
      console.log('channeldata', data);
    });

    socket.on('message', function(data) {
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
    if (id === cl.channel.current.id) {
      if (callback) {
        callback(cl.channel.current);
        complete=true;
      } else {
        return cl.channel.current;
      }
    }
    for (var t in cl.channel.pls) {
      if (cl.channel.pls[t].id === id) {
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


