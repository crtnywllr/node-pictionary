var socket = io();

var pictionary = function() {
    var canvas, context, drawing, guessBox;

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
<<<<<<< HEAD
        //console.log(drawing);
=======
        console.log(drawing);
>>>>>>> eb566b7a527992ca559f49d3199bed2bb818cb7c
    });
    canvas.on('mouseup', function() {
        drawing = false;
<<<<<<< HEAD
        //console.log(drawing);
=======
        console.log(drawing);
>>>>>>> eb566b7a527992ca559f49d3199bed2bb818cb7c
    })
    canvas.on('mousemove', function(event) {
        var offset = canvas.offset();
        var position = {
            x: event.pageX - offset.left,
            y: event.pageY - offset.top
        };
        if (drawing) {
<<<<<<< HEAD
            draw(position);
            socket.emit('draw', position);
            // this is the event that listens for other drawers
        }
    });
    socket.on('draw', draw);

    //Guesses
    var onKeyDown = function(event) {
        if (event.keyCode != 13) {
            return;
        }
        socket.emit('guess', guessBox.val());
        guessBox.val('');
    };
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);

    // Add the guesses to the UI of each user
    var addGuess = function(guess) {
        $('#guesses').text(guess);
    };

    socket.on('guess', addGuess);
};



=======
        draw(position);
        socket.emit('draw', position);
        // this is the event that listens for other drawers
        }
    });
    socket.on('draw', draw); 
};


>>>>>>> eb566b7a527992ca559f49d3199bed2bb818cb7c

$(document).ready(function() {
    pictionary();
});