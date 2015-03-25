'use strict';

var app = angular.module('trigger');

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
      console.log(data);
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
