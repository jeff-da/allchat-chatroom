var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgList = [
                {
                  name: '',
                  text: 'Send a message!',
                  location: null,
                },
                {
                  name: '',
                  text: 'Hello! Welcome to the chatroom.',
                  location: null,
                }
              ];
var nickname = 'Clueless Monkey';
let adjectives = ['Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome'
                  , 'Magnificent', 'Old-Fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Wide-Eyed'
                  , 'Alive', 'Cleaver', 'Odd', 'Powerful', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful'
                  , 'Silly', 'Thankful', 'Victorious', 'Witty', 'Zealous', 'Proud', 'Clumsy', 'Embarrased'
                  , 'Helpless', 'Mysterious', 'Scary', 'Gigantic', 'Huge', 'Little', 'Puny', 'Calm'
                  , 'Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome'
                  , 'Magnificent', 'Old-Fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Wide-Eyed'
                  , 'Alive', 'Cleaver', 'Odd', 'Powerful', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful'
                  , 'Silly', 'Thankful', 'Victorious', 'Witty', 'Zealous', 'Proud', 'Clumsy', 'Embarrased'
                  , 'Helpless', 'Mysterious', 'Scary', 'Gigantic', 'Huge', 'Little', 'Puny', 'Calm'];
let nouns = ['Coyote', 'Lynx', 'Octopus', 'Penguin', 'Monkey', 'Dragon', 'Whale', 'Dog', 'Panther', 'Ocelot'
            , 'Crocodile', 'Duck', 'Bear', 'Gecko', 'Hippo', 'Wolf', 'Toucan', 'Sloth', 'Tiger', 'Dolphin'
            , 'Pigeon', 'Turkey', 'Duck', 'Chicken', 'Rat', 'Cat', 'Donkey', 'Rabbit', 'Sheep', 'Buffalo'
            , 'Deer', 'Eagle', 'Eel', 'Earthworm', 'Chipmunk', 'Cheetah', 'Cardinal', 'Charmeleon', 'Dinosaur'
            , 'Coyote', 'Lynx', 'Octopus', 'Penguin', 'Monkey', 'Dragon', 'Whale', 'Dog', 'Panther', 'Ocelot'
            , 'Crocodile', 'Duck', 'Bear', 'Gecko', 'Hippo', 'Wolf', 'Toucan', 'Sloth', 'Tiger', 'Dolphin'
            , 'Pigeon', 'Turkey', 'Duck', 'Chicken', 'Rat', 'Cat', 'Donkey', 'Rabbit', 'Sheep', 'Buffalo'
            , 'Deer', 'Eagle', 'Eel', 'Earthworm', 'Chipmunk', 'Cheetah', 'Cardinal', 'Charmeleon', 'Dinosaur'];
var nicknames = new Map();

function Node(data) {
  this.data = data;
  this.next = null;
}

function LinkedList() {
  this.head = null;
}

LinkedList.prototype.add = function(value) {
    var node = new Node(value),
        currentNode = this.head;

    // 1st use-case: an empty list
    if (!currentNode) {
        this.head = node;
        return node;
    }

    // 2nd use-case: a non-empty list
    while (currentNode.next) {
        currentNode = currentNode.next;
    }

    currentNode.next = node;

    return node;
};

// remove from head of list
LinkedList.prototype.remove = function() {
  if (this.head != null) {
    var value = this.head;
    this.head = this.head.next;
    console.log(value);
    return value.data;
  } else return null;
};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(nick, msg){
    console.log(nick + msg);
    msgList.unshift({
                      name: nick,
                      text: msg,
                      location: null
                    });
    if (msgList.length > 20) {
      msgList.splice(20, 1);
    }
    io.emit('message list', msgList);
  });

  socket.on('location message', function(nick, msg, location){
    console.log(nick + 'has shared location');
    msgList.unshift({
                     name: nick,
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
      // change .length to check if the head is null
      if (nicknames.get(adjectives[index]).head == null) {
        adjectives.splice(index, 1);
        index = 0;
      }
      // change adjectives[index].pop() to take the value of head and use it as the
      // noun, then move head to head.next.
      io.emit('name', adjectives[index] + ' ' + nicknames.get(adjectives[index]).remove());
    } else {
      io.emit('name', 'Another Wandering Traveler');
    }
  });
});

http.listen(process.env.PORT || 3000, function(){
  console.log('listening on *:3000');

  for (const adjective of adjectives) {
    nicknames.set(adjective, new LinkedList());
    for (var i = 0; i < 15000; i++) {
      nicknames.get(adjective).add(nouns[Math.floor(Math.random() * 75)]);
    }
    // !!
    // add the nouns in the array in a random order
    /*var count = Math.floor(Math.random() * 1027);
    for (var i = 0; i < count; i++) {
      nicknames.get(adjective).push(nicknames.get(adjective).shift());
    }*/
  }
});
