(function () {
    var connect_btn = document.getElementById('connect_btn');
    var input_name = document.getElementById('input_name');
    var main_login = document.getElementById('main_login');

    var send_btn = document.getElementById('send_btn');
    var input_msg = document.getElementById('input_msg');

    var main_room = document.getElementById('main_room');
    var top_room = document.getElementById('top_room');
    var list_room = document.getElementById('list_room');
    var p_list = document.getElementById('p_list');
    var p_count = document.getElementById('p_count');

    var flag;
    function action(obj) {
        console.log(obj);
        var p_temp = '';
        for (var i in obj.onlineUsers) {
            p_temp += obj.onlineUsers[i] + ' ';
        }
        p_count.innerHTML = '在线人数:' + obj.onlineCount + ' 在线用户:' + p_temp;
        var child = document.createElement('div');
        p_list.appendChild(child);
        child.className = 'action';
        child.innerHTML = obj.user.username + ((flag) ? ' 加入了聊天室' : ' 退出了聊天室');
        window.scrollTo(0, list_room.clientHeight);
    }

    function mes_action(o) {
        var chil = document.createElement('div');
        var chil_name = document.createElement('h1');
        var chil_content = document.createElement('div');
        p_list.appendChild(chil);
        chil.appendChild(chil_name);
        chil.appendChild(chil_content);
        if (o.userid === CHAT.userid) {
            chil.className = 'host';
            chil_name.className = 'host_name';
            chil_content.className = 'host_content';
        }
        else {
            chil.className = 'client';
            chil_name.className = 'client_name';
            chil_content.className = 'client_content';
        }
        chil_name.innerHTML = o.username;
        chil_content.innerHTML = o.content;
        input_msg.value = '';
        window.scrollTo(0, list_room.clientHeight);
    }

    window.CHAT = {
        socket: null,
        userid: null,
        username: '',
        init: function () {
            this.socket = io.connect('ws://127.0.0.1:3030');
            this.socket.emit('login', {userid: this.userid, username: this.username});

            this.socket.on('login', function (obj) {
                console.log('on');
                flag = true;
                action(obj);
            });
            this.socket.on('logout', function (obj) {
                console.log('out');
                flag = false;
                action(obj);
            });
            this.socket.on('message', function (o) {
                console.log('message');
                console.log(o.content);
                mes_action(o);
            });
        },
        username_submit: function () {
            console.log('username submit');
            CHAT.userid = this.genUid();
            CHAT.username = input_name.value;
            main_login.style.display = 'none';
            main_room.style.display = 'block';
            top_room.childNodes[3].childNodes[1].innerHTML = CHAT.username;

            sessionStorage.setItem('userid', this.userid);
            sessionStorage.setItem('username', this.username);
            if (input_name.value == '') {
                alert('please input name!');
                main_login.style.display = 'block';
                main_room.style.display = 'none';
            }
            else {
                CHAT.init();
            }
        },
        content_submit: function () {
            console.log('content submit');
            if (input_msg.value != '') {
                var o = {
                    userid: CHAT.userid,
                    username: CHAT.username,
                    content: input_msg.value
                };
                this.socket.emit('message', o);

            }
        },
        genUid: function () {
            return new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
        }
    };

    connect_btn.onclick = function () {
        CHAT.username_submit();
    };
    top_room.childNodes[3].childNodes[3].onclick = function () {

        sessionStorage.userid = '';
        sessionStorage.username = '';
        location.reload();
    };
    send_btn.onclick = function () {
        CHAT.content_submit();
    };
    input_msg.onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.content_submit();
        }
    };
    input_name.onkeydown = function (e) {
        e = e || event;
        if (e.keyCode === 13) {
            CHAT.username_submit();
        }
    };
    if (sessionStorage.userid) {
        CHAT.userid = sessionStorage.userid;
        CHAT.username = sessionStorage.username;
        main_login.style.display = 'none';
        main_room.style.display = 'block';
        CHAT.username_submit();
    }
}(window));