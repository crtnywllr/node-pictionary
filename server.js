var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);
var users = [];

io.on('connect', function(socket) {
   // console.log('Client connected');
  
    
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('guess', function(guessBox){
        socket.broadcast.emit('guess', guessBox);
    })
    
    socket.on('addUser', function(username){
       socket.username = username;
        users.push(username);
       // console.log(users[0]);
        //console.log(users);
       socket.broadcast.emit('addUser', username); 
       io.emit('setDrawer', users[0]);
    });
    
    socket.on('disconnect', function() {
        users = users.filter(function(user, index){
            return user !== socket.username;
        });
        //console.log(users[0]);
        //console.log(users);
        socket.broadcast.emit('updateUsers', users);
      });
     
   
     //io.emit('setDrawer', users[0]);
     //console.log(users[0]);
      
});

server.listen(8080);