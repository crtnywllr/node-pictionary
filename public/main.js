/* global $ */
/* global io */
var socket = io();

var pictionary = function() {
    var canvas, context, drawing, drawer, guessBox, word, me;
    var username = prompt('What\'s your name?') || "Guest";

    //Update userlist 
   var updateUsers = function(users) {
        $('#users').empty();
        users.forEach(function(user){
            if(user.name != username){
                 addUser(user);
            } else {
                me = user
            }
        });
   };
    //Add users
    var addUser = function(user) {
        var isDrawer = "notDrawing";
        if(user.drawer){
            isDrawer = "isDrawing";
        }
        $('#users').append('<div><button id="'+ user.id +'" class="'+isDrawer+'">' + user.name + '</button></div>');
    };
    $('#users').on('click','button', function() {
        console.log("Clicked");
        if (me.drawer){
            var uName = $(this).text();
            var uId = $(this).attr('id');
            
            // $('#guesses').append(uName + " is the winner! The word was " + word);
            // setDrawer(uName);
            clear()
            socket.emit('pickWinner', uId);
            console.log('pickWinner', uId);
        }
    });
    
    var showWinner = function(user){
        $('#guesses').append(user.name + " is the winner! The word was " + word);
    }
//Drawing 
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };
    var clear = function(){
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    }

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        if(me.drawer){
            drawing = true;
        }
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
        if (drawing) {
            draw(position);
            socket.emit('draw', position);
            // this is the event that listens for other drawers
        }
    });
        
//Clearing the canvas    
   $('#clear').click(clear);

//Guesses
    // Show guess history
    var addGuess = function(guess) {
        $('#guesses').append('<div>' + guess + '</div>');
        console.log(guess);
    };
    //Capture guess input, return input
    guessBox = $('#guess input');
    guessBox.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        
        var guess = guessBox.val();
        addGuess(guess);
        socket.emit('guess', guess);
        guessBox.val('');
    });
    
    socket.emit('addUser', username);
    socket.on('draw', draw);    
    socket.on('updateUsers', updateUsers);
    socket.on('guess', addGuess);
    socket.on('showWinner',showWinner);
};
       

$(document).ready(pictionary);

//Set Drawer    
/*var setDrawer = function(user) {
    if (username == user) {
    drawer = true;
    //console.log(username);
} 
};

socket.on('setDrawer', setDrawer);

//Pick winner
$('.nameButton').on('click', function() {
    console.log("Clicked");
    var uName = $(this).text();
    
    setDrawer(uName);
    context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    socket.emit('pickWinner', uName);
    console.log('pickWinner', uName);
});

socket.on('pickWinner', setDrawer ); 

//Update drawer screen
if (drawer) {
    $('#clear').show();
}*/
