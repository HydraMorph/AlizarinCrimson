function Client(host) {
    this.version = 2205;
    this.user = null;
    this.channel = {}
    this.callbacks = {};
    this.chat = null;
    this.trackscache = [];
}

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
}

$(document).ready(function() {
    client = new Client();
    console.log(client);
    $(client).bind('welcome', function(event, data) {
        if (data) {
            showChannels(data);
            var user = $.Storage.get("username"), pass = $.Storage.get("password");
            if (user) {
                if (pass) {
                    client.login(user, pass, processLogin);
                    console.log('user' + user);
                }
            }
        }
    });
    client.init(location.host);
}

function onChannel(data) {
    setCurrent(data.current);
    setcurtime(true);
    $.Storage.set("channel", client.channel.chid + ' ');
    //$('#console .info .chname').html('<a href="javascript:showChannels();void(0);">' + data.name + '<a>');
    $('#console .info .chdata').html('<span>Слушают: </span>' + data.lst);
    $('#console .info .chdata').html('<span>Слушают: </span>' + data.lst + '<span> из них активно: </span>' + data.a);
    $('#console .streamcontrol .links').html('<a href="' + client.channel.hi + '" target="_blank">192kbps</a>');
    var list = $('#playlist .list');
    list.html('');
    for (var t in data.pls) {
        addtrack(data.pls[t]);
    }
    if (list.height() < $('#playlist .inner').height()) {
        $('#playlist .list .advice').remove();
        list.append('<li class="advice">Самое время нести!</li>');
    } else {
        $('#playlist .list .advice').remove();
    }
    updatetimes();
    if (client.user) {
        $('#info .tabs .chat').trigger('click');
    }
    if (data.changed) {
        var startplay = $.Storage.get("play");
        if (startplay == 't' +
            'rue') {
            player.play(client.channel.hi);
            $.Storage.set("play", 'false');
            $('#console .streamcontrol .play').click();
        }
    }
    newTagline();

}


function processLogin(data) {
    console.log('process login', data);
    if (data.user) {
        var rc = $.Storage.get("constitution");
        if (rc!='read'){
            readConstitution();
        }
        newTagline();
        $('.loginform').hide(400);
        $('.goin').hide();
        $('.submit_box').show(400);
        $('#info .tabs .chat').show();
        $('#info .tabs .profile').show();
        $('#console .upfiles').show();
    } else {
        if (data.error) {
            $('.loginform .alert').html(data.error);
        }
    }
    var ch = $.Storage.get("channel");
    if (ch) {
        client.goChannel(parseInt(ch), onChannel);
    } else {
        client.goChannel(1, onChannel);
    }
}

function goLogin() {
    $('.loginform .alert').html('');
    if (recovery) {
        var mail = $('#lgname').val();
        if (mail.length > 3) {
            client.recover(mail, function(data) {
                if (data.ok) {
                    $('.loginform .alert').html(data.m);
                } else {
                    if (data.e == 'no user') {
                        $('.loginform .alert').html('С таким почтовым ящиком ни кто не регистрировался (');
                    } else {
                        $('.loginform .alert').html(data.e);
                    }
                }
            });
        } else {
            $('.loginform .alert').html('Я не смогу восстановить пароль без адреса почтового ящика');
        }
    } else {
        var name = $('#lgname').val(),
            pass = $('#lgpass').val();
        if (name.length > 0 && pass.length > 0) {
            pass = hex_md5(pass);
            if (remember_name) {
                $.Storage.set("username", name);
                $.Storage.set("password", pass);
            } else {
                $.Storage.set("username", '');
                $.Storage.set("password", '');
            }
            client.login(name, pass, processLogin);
        }
    }
}


