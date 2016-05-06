/* global $ */
/* global io */
var socket = io();

var pictionary = function() {
    var canvas, context, drawing, drawer, guessBox, word, me;
    var incognitoMode = false;
    var username = prompt('What\'s your name?') || "Guest";

 /*Display information modal box */
    $(".how").click(function () {
        $(".overlay").fadeIn(1000);

    });

    /* Hide information modal box */
    $("a.close").click(function () {
        $(".overlay").fadeOut(1000);
    });


    //Update userlist 
    var updateUsers = function(users) {
        $('#users').empty();
        users.forEach(function(user) {
            if (user.name != username) {
                addUser(user);
            } else {
                me = user;
                updatePoints(me.points);
                if (me.drawer) {
                    setWord(me.word);
                    if (me.points > 50) {
                        incognitoMode = true;
                        $('#incognito').show();
                    }
                } else {
                    $('#word').hide();
                    $('#guess').show();
                     $('#incognito').hide();
                }
            }
        });
    };
    // update points
    var updatePoints = function(points) {
            $('#points').html("Points: <span class=highlight>" + points + "</span>");
        }
        //Add users
    var addUser = function(user) {
        var isDrawer = "notDrawing";
        if (user.drawer) {
            isDrawer = "isDrawing";
        }
        $('#users').append('<div><button id="' + user.id + '" class="' + isDrawer + '">' + user.name + '</button></div>');
    };
    // Selecting the winner
    $('#users').on('click', 'button', function() {
        if (me.drawer) {
            var uName = $(this).text();
            var uId = $(this).attr('id');
            clear();

            socket.emit('pickWinner', uId);
            socket.emit('clearCanvas')
        }
    });
    //Displaying winner message
    var showWinner = function(obj) {
        $('#guesses').append(obj.newDrawer.name + " is the winner! The word was " + obj.word + '<br/>').show();
        setTimeout(function() {
            $('#guesses').empty();
        }, 1500);
    }

    //Displaying word to draw
    var setWord = function(word) {
            $('#word').text("You are the drawer! Your word is: " + word).show();
            $('#guess').hide();
        }
        //Drawing 
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y, 6, 0, 2 * Math.PI);
        context.fill();
    };
    var clear = function() {
        context.clearRect(0, 0, canvas[0].width, canvas[0].height);
    }

    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.on('mousedown', function() {
        if (me.drawer) {
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
            if (!incognitoMode) {
                draw(position);
            }
            socket.emit('draw', position);
            // this is the event that listens for other drawers
        }
    });
    $('#clear').on('click', function() {
        if (me.drawer) {
            clear();
            socket.emit('clearCanvas')
        }

    });


    //Guesses
    // Show guess history
    var addGuess = function(obj) {
        $('#guesses').append('<div><strong><span class="highlight">' + obj.user + ":</span></strong> " + obj.guess + '</div>');
        // console.log(obj.user);
    };
    //Capture guess input, return input
    guessBox = $('#guess input');
    guessBox.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }

        var guess = guessBox.val();
        addGuess({
            user: 'Me',
            guess: guess
        });
        socket.emit('guess', guess);
        guessBox.val('');
    });

    socket.emit('addUser', username);
    socket.on('draw', draw);
    socket.on('updateUsers', updateUsers);
    socket.on('guess', addGuess);
    socket.on('showWinner', showWinner);
    socket.on('clearCanvas', clear);
};


$(document).ready(pictionary);