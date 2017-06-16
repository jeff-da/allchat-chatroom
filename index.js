var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgList = [
                {
                  text: 'Hello! Welcome to the chatroom.',
                  location: null,
                },
                {
                  text: 'Send a message!',
                  location: null,
                }
              ];
var nickname = 'Clueless Monkey';
let adjectives = ['Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome'
                  , 'Magnificent', 'Old-Fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Wide-Eyed'];
var nicknames = new Map();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    if (msg.coords != null) {
       io.emit('location', msg);
    } else {
       msgList.unshift({
                        text: msg,
                        location: null
                      });
    }
    if (msgList.length > 20) {
      msgList.splice(20, 1);
    }
    io.emit('message list', msgList);
  });

  socket.on('location message', function(msg, location){
    console.log('location message: ' + msg);
    msgList.unshift({
                     text: msg,
                     location: location,
                   });
    if (msgList.length > 20) {
      msgList.splice(20, 1);
    }
    io.emit('message list', msgList);
  });

  socket.on('name', function(nick) {
    var index = Math.floor(Math.random() * adjectives.length);
    if (adjectives.length != 0) {
      if (nicknames.get(adjectives[index]).length === 0) {
        adjectives.splice(index, 1);
        index = 0;
      }
      io.emit('name', adjectives[index] + ' ' + nicknames.get(adjectives[index]).pop());
    } else {
      io.emit('name', 'Another Wandering Traveler');
    }
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');

  for (const adjective of adjectives) {
    nicknames.set(adjective, ['Coyote', 'Lynx', 'Octopus', 'Penguin', 'Monkey', 'Dragon', 'Whale', 'Dog', 'Panther', 'Ocelot'
                              , 'Crocodile', 'Duck', 'Bear', 'Gecko', 'Hippo', 'Wolf', 'Toucan', 'Sloth', 'Tiger', 'Dolphin']);
    var count = Math.floor(Math.random() * 20);
    for (var i = 0; i < count; i++) {
      nicknames.get(adjective).push(nicknames.get(adjective).shift());
    }
  }
});
