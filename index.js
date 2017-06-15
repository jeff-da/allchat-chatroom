var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgList = ['Hello! Welcome to the chatroom.', 'Messages will appear below :)'];
var nickname = 'Clueless Monkey';
let adjectives = ['Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome'
                  , 'Magnificent', 'Old-Fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Wide-Eyed'];
let nouns = ['Coyote', 'Lynx', 'Octopus', 'Penguin', 'Monkey', 'Dragon', 'Whale', 'Dog', 'Panther', 'Ocelot'
             , 'Crocodile', 'Duck', 'Bear', 'Gecko', 'Hippo', 'Wolf', 'Toucan', 'Sloth', 'Tiger', 'Dolphin'];
var nicknames = new Map();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
    if (msg.coords != null) {
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
      // this is not working. its finding keys that dont have a array attached
      if (nicknames.get(adjectives[index]).length === 0) {
        // index --?
        adjectives.splice(index, 1);
        index = 0;
      }
      // if the array doesnt exist emit another wandering traveler
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
    nicknames.set(adjective, ['Coyote', 'Lynx', 'Octopus', 'Penguin', 'Monkey', 'Dragon', 'Whale', 'Dog', 'Panther', 'Ocelot'
                              , 'Crocodile', 'Duck', 'Bear', 'Gecko', 'Hippo', 'Wolf', 'Toucan', 'Sloth', 'Tiger', 'Dolphin']);
    var count = Math.floor(Math.random() * 20);
    for (var i = 0; i < count; i++) {
      nicknames.get(adjective).shift();
    }
    nicknames.get(adjective).pop();
  }
  // create map
});
