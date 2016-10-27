/**
 * Created by Administrator on 2016/10/24.
 */
(function () {
    var connect_btn = document.getElementById('connect_btn');
    var send_btn = document.getElementById('send_btn');
    var input_msg = document.getElementById('input_msg');
    var main_login = document.getElementById('main_login');
    var main_room = document.getElementById('main_room');
    var top_room = document.getElementById('top_room');
    var list_room = document.getElementById('list_room');
    var input_name = document.getElementById('input_name');
    var p_list = document.getElementById('p_list');

    var url = 'ws://127.0.0.1:3000';
    var socket;
    var id_temp;
    var u_name;

    top_room.childNodes[3].childNodes[3].onclick = function () {
        location.reload();
    };
    input_msg.onkeydown = function (e) {
        var content = input_msg.value;
        e = e || event;
        if (e.keyCode === 13) {
            var obj = {
                userid: id_temp,
                username: u_name,
                content: content
            };
            socket.emit('message', obj);
            input_msg.value = '';
        }
        //return false;
    };
    send_btn.onclick = function () {

        console.log(input_msg.value);
        var obj = {
            userid: id_temp,
            username: input_name.value,
            content: input_msg.value
        };
        socket.emit('message', obj);
    };
    input_name.onkeydown = function (e) {
        var content = input_name.value;
        e = e || event;
        if (e.keyCode === 13) {
            fun_login();
        }
    };
    connect_btn.onclick = function () {
        fun_login();
    };
    function fun_login() {
        socket = io.connect(url);
        main_login.style.display = 'none';
        main_room.style.display = 'block';
        id_temp = new Date().getTime() + "" + Math.floor(Math.random() * 899 + 100);
        u_name = input_name.value;
        socket.emit('login', {
            userid: id_temp,
            username: input_name.value
        });
        socket.on('login', function (o) {
            console.log('on');
            var p_temp = '';
            for (var i in o.onlineUsers) {
                p_temp += o.onlineUsers[i] + ' ';
                //console.log(o.onlineUsers[i]);
            }
            console.log(o);
            top_room.childNodes[3].childNodes[1].innerHTML = u_name;
            list_room.childNodes[1].innerHTML = '在线人数：' + o.onlineCount + ' 在线列表：' + p_temp;
            //console.log(o.onlineCount);
            var chil = document.createElement('div');
            p_list.appendChild(chil);
            chil.className = 'action';
            chil.innerHTML = o.user.username + '加入了聊天室';
        });
        socket.on('logout', function (o) {
            console.log('out');
            console.log(o);
            var chil = document.createElement('div');
            p_list.appendChild(chil);
            chil.className = 'action';
            chil.innerHTML = o.user.username + '退出了聊天室';
            var p_temp = '';
            for (var i in o.onlineUsers) {
                p_temp += o.onlineUsers[i] + ' ';
                //console.log(o.onlineUsers[i]);
            }
            list_room.childNodes[1].innerHTML = '在线人数：' + o.onlineCount + ' 在线列表：' + p_temp;
        });
        socket.on('message', function (obj) {
            console.log(obj);
            //console.log(obj.userid);
            //console.log(obj.username);
            //console.log(obj.content);
            var chil = document.createElement('div');
            var chil_name = document.createElement('h1');
            var chil_content = document.createElement('div');
            p_list.appendChild(chil);
            chil.appendChild(chil_name);
            chil.appendChild(chil_content);
            if (obj.userid === id_temp) {
                chil.className = 'host';
                chil_name.className = 'host_name';
                chil_content.className = 'host_content';
            }
            else {
                chil.className = 'client';
                chil_name.className = 'client_name';
                chil_content.className = 'client_content';
            }
            chil_name.innerHTML = obj.username;
            chil_content.innerHTML = obj.content;
            input_msg.value = '';
            window.scrollTo(0, list_room.clientHeight);
        });
        //console.log(1);
    }
}(window));