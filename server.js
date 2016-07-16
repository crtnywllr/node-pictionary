require('./db/connect');
var seed = require('./db/seed');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var wordRoutes = require('./routes/word');
var socket_io = require('socket.io');

var app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', wordRoutes);
app.use('*', function(req, res) {
    res.status(404).json({ message: 'Not Found' });
});

var server = http.Server(app);
var io = socket_io(server);

var usersArray = [];
var lastId = 0
var drawer = null;

function addUser(username) {
    var user = {
        name: username,
        id: lastId++,
        drawer:false,
        word:null,
        points: 0,
        waiting: true
    }
    usersArray.push(user);
    if (!drawer) {  
    setDrawer(user);
    /*How to make start button appear only for this first person?*/
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
           userObj.waiting = false;
        } else{
            userObj.drawer = false;
            userObj.waiting = false;
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
    });
   socket.on('pickWinner', function(uId) {
       //change the current drawer
       var newDrawer = usersArray[getDrawerIndex(uId)]
       newDrawer.points += 10;
       setDrawer(newDrawer);
       usersArray.forEach(function(user,index){
           user.waiting = false;
        });
      io.emit('updateUsers',usersArray)
      io.emit('showWinner', {newDrawer:newDrawer});
      });
   socket.on('clearCanvas', function () {
        io.emit('clearCanvas');
   })
   socket.on('disconnect', function(event){
        removeUser(socket.userID);
        io.emit('updateUsers',usersArray)
   });
});

server.listen(process.env.PORT ||8080);

/*Idea for adding timeout to change drawer after inactivity

var idleSeconds = 30;

$(function(){
  var idleTimer;
  function resetTimer(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(whenUserIdle,idleSeconds*1000);
  }
  $(document.body).bind('mousemove,keydown,click',resetTimer);
  resetTimer(); // Start the timer when the page loads
});

function whenUserIdle(){
  //...
}*/