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
<<<<<<< HEAD
    
    socket.on('guess', function(guessBox){
        io.emit('guess', guessBox);
    })
=======
    var clients = io.sockets.clients();
    // console.log('clients: ',clients.adapter.rooms);
    console.log(socket.nsp.sockets);
    socket.on('game start', function(){
        
    });
>>>>>>> eb566b7a527992ca559f49d3199bed2bb818cb7c
});

server.listen(8080);