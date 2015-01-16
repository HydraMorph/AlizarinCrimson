var MD5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
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
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
       }

     var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

     return temp.toLowerCase();
}


function sortFunction(a, b) {
    if (a.r < b.r) {
        return 1;
    }
    if (a.r > b.r) {
        return -1;
    }
    if (a.r == b.r) {
        return parseInt(a.id) - parseInt(b.id);
    }
    return 0

}


function findUrl(image, size) {
    var n, entry;
    for (n = 0; n < image.length; ++n) {
        entry = image[n];
        if (entry.size == size) {
            var p = entry["#text"];
            if (p.length > 0) {
                return entry["#text"];
            }
        }
    }
    return 'img/nocover.png';
}

function getcover(a, t, callback) {
    var src = 'img/nocover.png';
    if (lastfm) {
        lastfm.track.getInfo({artist: a, track: t, autocorrect: 1}, {
            success: function(data) {
                try {
                    src = findUrl(data.track.album.image, 'medium');
                    callback(src);
                } catch (err) {
                    lastfm.artist.getInfo({artist: a, autocorrect: 1}, {
                        success: function(data) {
                            src = findUrl(data.artist.image, 'medium');
                            callback(src);
                        },
                        error: function(code, message) {
                            callback(src);
                        }
                    });
                }
            },
            error: function(code, message) {
                callback(src);
            }
        });
    }

}


function Client(host) {
    this.version = 2205;
    this.user = null;
    this.channel = {}
    this.callbacks = {};
    this.chat = null;
    this.trackscache = [];
}

var lastfm = null;

Client.prototype.init = function(host) {
    console.log('init');
   // this.socket = io.connect(host, {resource: 'socket.io'});
    this.socket=io('http://trigger.fm');
    var socket=this.socket;
    var cl = this;

    socket.on('welcome', function(data) {
        $(cl).trigger('welcome', data);
    });

    socket.on('getver', function() {
        socket.emit('ver', {'v': cl.version, 'init': true});
    });

    socket.on('addtrack', function(data) {
        data.track.src = 'img/nocover.png';
        var track = data.track
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

        cl.channel.pls.push(track);
        cl.channel.pls.sort(sortFunction);
        $(cl).trigger('addtrack', data);
        getcover(track.a, track.t, function(src) {
            track.src = src;
            $(cl).trigger('cover', {id: data.track.id, 'src': src});
        });

    });
    socket.on('removetrack', function(data) {
        for (var t in cl.channel.pls) {
            if (cl.channel.pls[t].id == data.tid) {
                data.track = cl.channel.pls[t];
                $(cl).trigger('removetrack', data);
                cl.channel.pls.splice(t, 1);
                break;
            }
        }
    });

    socket.on('newcurrent', function(data) {
        if (data.chid == cl.channel.chid) {
            for (var tr in cl.channel.pls) {
                if (cl.channel.pls[tr].id == data.track.id) {
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
        if (cl.chat) {
            for (var us in cl.chat.u) {
                if (cl.chat.u[us].id == data.uid) {
                    cl.chat.u[us].a = data.a;
                }
            }
            $(cl).trigger('userupdate', data);
        }
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
            getcover(tr.a, tr.t, function(src) {
                tr.src = src;
                $(cl).trigger('cover', {id: tr.id, 'src': src});
                i += 1;
                if (i < cl.channel.pls.length) {
                    gg();
                }
            });
        }
        data.changed = true;
        data.hi = streampath + data.hi;
        data.low = streampath + data.low;
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
        getcover(data.current.a, data.current.t, function(src) {
            data.current.src = src;
            $(cl).trigger('cover', {id: data.current.id, 'src': src});
        });

        cl.callbacks.channeldata(cl.channel);
        if (cl.channel.pls.length > 0) {
            gg();
        }
    });

    socket.on('message', function(data) {
        cl.chat.m.push(data);
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
        if (cl.chat) {
            var user = {
                id: data.uid,
                n: data.n,
                a: data.a
            }
            cl.chat.u.push(user);
            $(cl).trigger('newuser', data);
        }
    });
    socket.on('offuser', function(data) {
        if (cl.chat) {
            for (var us in cl.chat.u) {
                if (cl.chat.u[us].id == data.uid) {
                    cl.chat.u.splice(us, 1);
                }
            }
            $(cl).trigger('offuser', data);
        }
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
        cl.channel = {}
        cl.callbacks = {};
        cl.chat = null;
    });
    socket.on('tags', function(data) {
        cl.callbacks.tags(data.t);
    });

    socket.on('uptr', function(data) {
        if (data.t.id == cl.channel.current.id) {
            var src = cl.channel.current.src;
            cl.channel.current = data.t;
            cl.channel.current.scr = src;
            var track = cl.channel.current;
            track.vote = 0;
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

            data.current = true;
        } else {
            for (var t in cl.channel.pls) {
                if (cl.channel.pls[t].id == data.t.id) {
                    cl.channel.pls[t] = data.t;
                    var track = cl.channel.pls[t];
                    track.vote = 0;
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
                    cl.channel.pls.sort(sortFunction);
                    data.current = false;
                    break;
                }
            }
        }
        $(cl).trigger('trackupdate', data);
    });
}

Client.prototype.login = function(name, pass, callback) {
    var cl = this;
    cl.callbacks.loginstatus = callback;
    this.socket.emit('login', {u: name, p: pass});
}
Client.prototype.track = function(id, callback) {
    var cl = this;
    var complete=false;
    if (id == cl.channel.current.id) {
        if (callback) {
            callback(cl.channel.current);
            complete=true;
        } else {
            return cl.channel.current
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

}
Client.prototype.getPlaylist = function(channel, callback) {
    cl = this;
    cl.callbacks.playlist = callback;
    this.socket.emit('getplaylist', {id: channel});
}
Client.prototype.goChannel = function(channel, callback) {
    var cl = this;
    cl.callbacks.channeldata = callback;
    this.socket.emit('gochannel', {id: channel});

}
Client.prototype.getChannels = function(callback) {
    var cl = this;
    cl.callbacks.channelsdata = callback;
    this.socket.emit('getchannels');
}
Client.prototype.getChat = function(data, callback) {
    var cl = this;
    this.socket.emit('getchat', {'shift': data.shift, 'id': this.channel.chid}, function(data) {
        if (data.u) {
            cl.chat = data;
            cl.chat.id = cl.channel.chid;
        }
        callback(data);
    });
}
Client.prototype.sendMessage = function(message, callback) {
    var data = {'m': message};
    this.socket.emit('sendmessage', data, callback);
}
Client.prototype.tracksubmit = function(data, callback) {
    var form = data.form;
    this.socket.emit('tracksubmit', {'chid': this.channel.chid, 'track': data.track}, function(data) {
        data.form = form;
        console.log('data.form: ', data.form);
        callback(data)
    });
}
Client.prototype.addvote = function(data, callback) {
    if (this.user) {
        data.chid = this.channel.chid;
        this.socket.emit('vote', data);
    }
}
Client.prototype.adduservote = function(data, callback) {
    if (this.user) {
        this.callbacks.uvotedata = callback;
        this.socket.emit('uvote', data);
    }
}
Client.prototype.getUser = function(data, callback) {
    this.socket.emit('getuser', data, callback);
}
Client.prototype.getHistory = function(shift, gold, callback) {
    cl = this;
    cl.callbacks.history = callback;
    this.socket.emit('gethistory', {chid: cl.channel.chid, s: shift, g: gold});
}
Client.prototype.getTags = function(str, callback) {
    cl = this;
    cl.callbacks.tags = callback;

    this.socket.emit('gettags', {s: str});
}
Client.prototype.getTrackTags = function(artist, title, callback) {
    cl = this;
    cl.callbacks.tags = callback;
    this.socket.emit('gettags', {a: artist, t: title});
}
Client.prototype.addTag = function(str, callback) {
    cl = this;
    cl.callbacks.tags = callback;
    this.socket.emit('addtag', {s: str});
}
Client.prototype.killtrack = function(track) {
    cl = this;
    this.socket.emit('deltrack', {tid: track, chid: cl.channel.chid});
}
Client.prototype.sendinvite = function(mail, code, callback) {
    cl = this;
    cl.callbacks.invitestatus = callback;
    this.socket.emit('sendinvite', {m: mail, c: code});
}

Client.prototype.sendextinvite = function(data, callback) {
    this.socket.emit('sendextinvite', data, callback);
}

Client.prototype.logout = function(callback) {
    this.socket.emit('logout', {s: true}, callback);
}
Client.prototype.recover = function(mail, callback) {
    cl = this;
    cl.callbacks.recover = callback;
    this.socket.emit('recover', {m: mail});
}
Client.prototype.changepass = function(oldpass, newpass, callback) {
    cl = this;
    cl.callbacks.changepass = callback;
    this.socket.emit('changepass', {o: oldpass, n: newpass});
}
Client.prototype.updateUserData = function(data) {
    this.socket.emit('upduserdata', data);

}
Client.prototype.updateTrack = function(data) {
    this.socket.emit('updtrack', data);
}
Client.prototype.getchannel = function(id) {
    for (var i in this.channels) {
        if (this.channels[i].id == id) {
            return this.channels[i];
        }
    }
    return false;
}

Client.prototype.banuser = function(uid, reason, callback) {
    console.log(reason);
    this.socket.emit('banuser', {id: uid, r: reason}, callback);
}
Client.prototype.unbanuser = function(uid, callback) {
    this.socket.emit('unbanuser', {id: uid}, callback);
}
Client.prototype.setop = function(d, callback) {
    this.socket.emit('setop', d, callback);
}
Client.prototype.removeop = function(data, callback) {
    this.socket.emit('removeop', data, callback);
}

Client.prototype.setprops = function(data, callback) {
    this.socket.emit('setprops', data, callback);
}
Client.prototype.sendPRVote = function(data, callback) {
    this.socket.emit('prvote', data, callback);
}


function processLogin(data) {
    console.log('process login', data);
//    var ch = 1;
//    client.goChannel(1, onChannel);
}

client = new Client();
console.log(client);
$(client).bind('welcome', function(event, data) {
  console.log('welcome');
  if (data) {
    var user = 'true';
    var pass = MD5("azaza123");
    client.login(user, pass, processLogin);
    console.log('user ' + user);
//    if (user) {
//      if (pass) {
//      } else {
//        client.goChannel(1, onChannel);
//      }
//    } else {
//      client.goChannel(1, onChannel);
//    }
  }
});
client.init(location.host);
