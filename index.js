var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgList = ['Hello! Welcome to the chatroom.', 'Messages will appear below :)'];
var nickname = 'Clueless Monkey';
let adjectives = ['Clueless', 'Cool', 'Awesome', 'Rad', 'Humble'];
let nouns = ['Monkey', 'Bird', 'Dog', 'Cat', 'Penguin'];
var nicknames = new Map();
var adjectivesUsed = 0;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    if (msg.coords != null) {
       //msgList.push('> Someone just shared their location! Latitude: '
       //+ msg.coords.latitude + ', Longitude: ' + msg.coords.longitude);
       io.emit('location', msg);
    } else {
       msgList.push(msg);
    }
    if (msgList.length > 20) {
      msgList.splice(0, 1);
    }
    io.emit('message list', msgList);
  });
  socket.on('name', function(nick) {
    // get random nickname
    var index = Math.floor(Math.random() * adjectives.length);
    // if you used all of the animals, get rid of the index
    if (adjectives.length != 0) {
      while (nicknames.get(adjectives[index]).length === 0) {
        // index --?
        adjectives.splice(index, 1);
        if (index >= adjectives.length) {
          index = 0;
        }
      }
      io.emit('name', adjectives[index] + ' ' + nicknames.get(adjectives[index]).pop());
    } else {
      io.emit('name', 'Another Wandering Traveler');
    }
  });
  console.log('a user connected');
});

/*setInterval(() => {
  io.emit('ping', { data: 23 });
}, 1000);*/
//(new Date())/1
http.listen(3000, function(){
  console.log('listening on *:3000');

  for (const adjective of adjectives) {
    nicknames.set(adjective, ['Monkey', 'Bird', 'Dog', 'Cat', 'Penguin']);
    // 5 is size of above array of nouns
    var count = Math.floor(Math.random() * 5);
    console.log(count);
    for (var i = 0; i < count; i++) {
      nicknames.get(adjective).shift();
    }
    nicknames.get(adjective).pop();
  }
  // create map
});
