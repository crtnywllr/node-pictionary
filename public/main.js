var socket = io();


var pictionary = function() {
    var canvas, context, drawing, drawer, guessBox;
    var username = prompt('What\'s your name?') || "Guest";
    
    //Add users
var addUser = function(username) {
    $('#users').append('<div><button>' + username + '</button></div>');
};

addUser(username);
socket.emit('addUser', username);


//Update userlist after disconnect
   var updateUsers = function(users) {
    $('#users').empty();
    users.forEach(function(username){
        addUser(username);
        socket.emit('updateUsers', users);
    });
   };

socket.on('addUser', addUser);
socket.on('updateUsers', updateUsers);

//Set Drawer    
var setDrawer = function(user) {
    if (username == user) {
    drawer = true;
} 
};

socket.on('setDrawer', setDrawer);

//Pick winner

//Update drawer screen
/*if (drawer) {
    $('#guess').hide();
    $('.players').show();
    $('#wordToDraw').show();
    $('.clearButton').show();
}*/

//Drawing 
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        drawing = true;
    });
    canvas.on('mouseup', function() {
        drawing = false;
    })
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        if (drawing && drawer) {
            draw(position);
            socket.emit('draw', position);
            // this is the event that listens for other drawers
        }
    });
    
   $('#clear').on('click', function() {
       console.log("I have been clicked");
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
      });
      
    socket.on('draw', draw);

//Guesses
    // Show guess history
    var addGuess = function(guess) {
        $('#guesses').append('<div>' + guess + '</div>');
    };
    //Capture guess input, return input
    guessBox = $('#guess input');
    guessBox.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        
        var guess = username + ": " + guessBox.val();
        addGuess(guess);
        socket.emit('guess', guess);
        guessBox.val('');
    });

socket.on('guess', addGuess);
};
       

$(document).ready(function() {
    pictionary();
});