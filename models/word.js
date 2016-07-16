var mongoose = require('mongoose');

var WordSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var Word = mongoose.model('Word', WordSchema);

module.exports = Word;