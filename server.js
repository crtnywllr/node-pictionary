var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));
var server = http.Server(app);
var io = socket_io(server);
var usersArray = [];
var userIndex = {};
var lastId = 0
var drawer = null;

  function addUser(username) {
      var user = {
          name: username,
          id: lastId++,
          drawer:false
      }
  usersArray.push(user);
//   usersIndex[user.id] = user;
  
  if (!drawer) {
    setDrawer(user);
  }
  
  return user.id;
}  
function removeUser(user) {
//   user = usersIndex[user.id];
  
//   if (user) {
//     var userIndex = usersArray.indexOf(user);
//     usersArray.splice(userIndex, 1);
//     if (drawer === user) {
//       var nextUser = usersArray[userIndex];
    
//       if (nextUser) {
//         setDrawer(nextUser);
//       }
//     }
//   }
}
function setDrawer(user) {
    console.log(user);
    usersArray = usersArray.map(function(userObj){
        console.log(user,userObj);
        if(userObj.id == user.id){
           userObj.drawer = true;   
        } else{
            userObj.drawer = false;
        }
        return userObj;
    });
  
  drawer = user;
}
function getDrawerIndex(id){
    console.log('id',id)
    var currentDrawerIndex;
    usersArray.forEach(function(user,index){
            if(user.id == id){
                currentDrawerIndex= index
            }
        });
    return currentDrawerIndex
}

io.on('connect', function(socket) {
   // console.log('Client connected');
   socket.on('addUser', function(username) {
        addUser(username);
        socket.emit('updateUsers',usersArray)
        socket.broadcast.emit('updateUsers', usersArray)
   })
    
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('guess', function(guessBox){
        socket.broadcast.emit('guess', guessBox);
    })
  
   socket.on('pickWinner', function(uId) {
       //change the current drawer
       var newDrawer = usersArray[getDrawerIndex(uId)]
       setDrawer(newDrawer);
       socket.emit('updateUsers',usersArray)
       socket.broadcast.emit('updateUsers',usersArray)
       //broadcast the list changed && broadcast the winner
      socket.emit('showWinner', newDrawer);
      socket.broadcast.emit('showWinner', newDrawer);
   })
      
});

server.listen(8080);