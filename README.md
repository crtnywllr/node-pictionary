# Pictionary

**Live demo**: (https://limitless-reef-83019.herokuapp.com)

**Purpose**: I built this game primarily to learn how to use web sockets to transmit data. Along the way I was introduced to higher order functions to help organize the data as I passed it back and forth. This was one of my favorite projects to build and really expanded my knowledge of how front and back end code can interact.

**Technologies used**: HTML5, HTML5 Canvas, CSS3, Flexbox, JavaScript, jQuery, NodeJS, express.js, sockets.io, NPM, Heroku

**Known bugs**: Since this was a student project and not for commercial use, I decided to learn how to apply Flexbox for responsiveness. This means that this app only runs in modern browsers.

**To Do List**: 
- move words and scores into database; words will persist but scores will be removed once the user leaves the game
- create waiting screen for users who join while game is in progress; clear screen upon a new winner being chosen
- add inactivity timeout on drawer to prevent game stall
- create system where drawer loses points if no one guesses their drawing on normal setting
- create system where drawer and guesser get extra points for getting an incognito mode answer
- -implement check for browser compatibility with Flexbox and alert users if they are not compatible