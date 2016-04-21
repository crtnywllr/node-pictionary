var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);


io.on('connect', function(socket) {
    console.log('Client connected');
    
    socket.username = socket.handshake.address;
    socket.isDrawing = false;
    // console.log(socket);
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    socket.on('guess', function(guessBox){
        socket.broadcast.emit('guess', guessBox);
    })
    var clients = io.sockets.clients();
    // console.log('clients: ',clients.adapter.rooms);
   // console.log(socket.nsp.sockets);
    socket.on('game start', function(){
        
    });
});

server.listen(8080);