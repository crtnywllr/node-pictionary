var express = require('express');
var Word = require('../services/word');
var router = express.Router();
var mongoose = require('mongoose');

function isMongoId(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send({
            success: false,
            msg: 'Parameter passed is not a valid Mongo ObjectId'
        })
    }
    next()
}
router.get('/words', function(req, res) {
    Word.list(function(words) {
        res.json(words);
    }, function(err) {
        res.status(400).json(err);
    });
});

router.post('/words', function(req, res) {
    Word.save(req.body.name, function(word) {
        res.status(201).json(word);
    }, function(err) {
        res.status(400).json(err);
    });
});

/*router.put('/items/:id', function(req, res) {
      Item.update(req.body.id, req.body.name, function(item) {
        res.status(200).json(item);
    }, function(err) {
        res.status(400).json(err);
    });
});

router.delete('/items/:id', isMongoId, function(req, res) {
    Item.remove(req.params.id, function(item) {
        res.status(200).json(item);
    }, function(err) {
        console.log(err);
        res.status(400).json(err);
    });
});*/

module.exports = router;