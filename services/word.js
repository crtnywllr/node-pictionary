var Word = require('../models/word');

exports.save = function(word, callback, errback) {
    Word.create({ name: word }, function(err, word) {
        if (err) {
            errback(err);
            return;
        }
        callback(word);
    });
};

exports.list = function(callback, errback) {
    Word.find(function(err, words) {
        if (err) {
            errback(err);
            return;
        }
        callback(words);
    });
};

/*exports.update = function(id, updatedName, callback, errback) {
   Item.findOneAndUpdate({_id: id}, {name: updatedName},  function(err, item) {
            if (err) {
          errback(err);
            return;
        }
      callback(item);
    });
};

exports.remove = function(id, callback, errback) {
    Item.findOneAndRemove({_id: id}, function(err, item) {
        if (err) {
          errback(err);
            return;
        }
      callback(item);
    });
};*/