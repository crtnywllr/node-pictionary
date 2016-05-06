var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);
var usersArray = [];
// var usersIndex = {};
var lastId = 0
var drawer = null;
var WORDS = [
    "lion", "sock", "number", "person", "pen", "banana", "people",
    "song", "water", "continent", "map", "man", "pool table", "woman", "bathroom", "boy",
    "girl", "circus", "cowboy", "roller skates", "laptop", "name", "jail", "toothbrush", "hair",
    "toast", "wreath", "hand", "house", "lobster", "animal", "trophy", "skis",
    "bicycle", "lightsaber", "world", "head", "page", "airplane", "fishing",
    "exam", "school", "plant", "food", "sun", "dinosaur", "eye", "city", "tree",
    "farm", "book", "seashell", "key", "salt and pepper", "bacon", "popcorn", "pillow", "lollipop",
    "couch", "child", "children", "rocket", "paper", "music", "river", "car",
    "foot", "coin", "book", "baseball", "bear", "king", "queen", "curtains",
    "mountain", "horse", "watch", "color", "face", "wood", "starfish", "bird",
    "body", "dog", "yoga", "worm", "door", "mountain", "yo-yo", "ship", "dart",
    "rock", "fast food", "fire", "bookshelf", "piece", "pirate", "castle", "teapot",
    "outer space"
];

function wordPicker(wordList) {
    return wordList[Math.floor(Math.random()*(wordList.length-1))];
};

  function addUser(username) {
      var user = {
          name: username,
          id: lastId++,
          drawer:false,
          word:null,
          points: 0
      }
  usersArray.push(user);
  
  if (!drawer) {
    setDrawer(user);
  }
  return user.id;
}  
function removeUser(userID) {
        var userIndex;
        usersArray.forEach(function(user,index){
            if(user.id == userID){
                userIndex = index
            }
        });
    usersArray.splice(userIndex, 1);
    
    if (drawer.id === userID) {
       var nextUser = usersArray[userIndex];
       if (nextUser) {
          setDrawer(nextUser);
       } else {
          setDrawer(usersArray[0])
       }
     }
}
function setDrawer(user) {
    usersArray = usersArray.map(function(userObj){
        if(userObj.id == user.id){
           userObj.drawer = true;
           userObj.word = wordPicker(WORDS);
        } else{
            userObj.drawer = false;
            userObj.word = null;
        }
        return userObj;
    });
  
  drawer = user;
}
function getDrawerIndex(id){
    var currentDrawerIndex;
    usersArray.forEach(function(user,index){
            if(user.id == id){
                currentDrawerIndex= index
            }
        });
    return currentDrawerIndex
}

io.on('connect', function(socket) {
   socket.on('addUser', function(username) {
        socket.userID = addUser(username); 
        io.emit('updateUsers',usersArray)})
    
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('guess', function(guessBox){
        var guesserindex = getDrawerIndex(socket.userID);
        socket.broadcast.emit('guess', {user: usersArray[guesserindex].name, guess:guessBox});
    })
  
   socket.on('pickWinner', function(uId) {
       //change the current drawer
       var word = drawer.word;
       var newDrawer = usersArray[getDrawerIndex(uId)]
       newDrawer.points += 10;
       setDrawer(newDrawer);
       io.emit('updateUsers',usersArray)
      io.emit('showWinner', {newDrawer:newDrawer, word:word});
      }) 
   socket.on('clearCanvas', function () {
             io.emit('clearCanvas');
   })
   socket.on('disconnect', function(event){
        removeUser(socket.userID);
        io.emit('updateUsers',usersArray)
   })
      
});

server.listen(8080);