var mongoose = require('mongoose');

var character = mongoose.model('Position');

exports.index = function(req, res){
   character.find({user:req.user._id},function(err,docs){
       res.send(docs);
   })
};

exports.new = function(req, res){
    var newChar = new character();
    newChar.user = req.user;
    newChar.name = req.user._id;
    newChar.experience = 0;
    newChar.class = 'Barbarian';
    newChar.race = 'Skeletton';

    newChar.save();

    res.send(newChar);
};

exports.create = function(req, res){
    res.send('create character');
};

exports.show = function(req, res){
    res.send('show character ' + req.params.id);
};

exports.edit = function(req, res){
    res.send('edit character ' + req.params.id);
};

exports.update = function(req, res){
    res.send('update character ' + req.params.id);
};

exports.destroy = function(req, res){
    character.remove({user:req.user._id, _id:req.param.id}, function(err,docs){
        res.send('destroy character ' + req.params.id);
    });
};

exports.destroyAll = function(req, res){
    character.remove({user:req.user._id}, function(err,docs){
        res.send('destroy all characters');
    });
};

exports.select = function(req,res){
    character.findOne({user:req.user._id},function(err,docs){
        if(docs != null){
            req.session.selectedChar = docs;
            res.send('Selected character ' + req.params.name);
        }
        else{
            res.send('Character not found :' + req.params.name);
        }
    });
};