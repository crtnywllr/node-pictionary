var Word = require('../models/word');

var WORDS = [
    'lion', 'sock', 'number', 'person', 'pen', 'banana', 'people',
    'song', 'water', 'continent', 'map', 'man', 'pool table', 'woman', 'bathroom', 'boy',
    'girl', 'circus', 'cowboy', 'roller skates', 'laptop', 'name', 'jail', 'toothbrush', 'hair',
    'toast', 'wreath', 'hand', 'house', 'lobster', 'animal', 'trophy', 'skis',
    'bicycle', 'lightsaber', 'world', 'head', 'ponytail', 'airplane', 'fishing',
    'exam', 'school', 'plant', 'food', 'sun', 'dinosaur', 'eye', 'city', 'tree',
    'farm', 'book', 'seashell', 'key', 'salt and pepper', 'bacon', 'popcorn', 'pillow', 'lollipop',
    'couch', 'child', 'children', 'rocket', 'paper', 'music', 'river', 'car',
    'foot', 'coin', 'book', 'baseball', 'bear', 'king', 'queen', 'curtains',
    'mountain', 'horse', 'watch', 'color', 'face', 'wood', 'starfish', 'bird',
    'body', 'dog', 'yoga', 'worm', 'door', 'mountain', 'yo-yo', 'ship', 'dart',
    'rock', 'fast food', 'fire', 'bookshelf', 'piece', 'pirate', 'castle', 'teapot',
    'outer space'
];

exports.run = function(callback, errback) {
    WORDS.forEach(function(word) {
        Word.create({name: word}, function(err, words) {
        if (err) {
            errback(err);
            return;
        }
        callback(words);
    });
        
    })
    
};

if (require.main === module) {
    require('./connect');
    exports.run(function() {
        var mongoose = require('mongoose');
        mongoose.disconnect();
    }, function(err) {
        console.error(err);
    });
}