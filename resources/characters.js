var mongoose = require('mongoose');

var character = mongoose.model('Character');
var position = mongoose.model('Position');

exports.index = function(req, res){
    character.find({user:req.user._id}).populate('position').run(function(err,docs){
        res.send(docs);
    })
};
exports.all = function(req, res){
    character.find({}).populate('position').run(function(err,docs){
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

    var charPos = new position();
    charPos.x = 150;
    charPos.y = 150;
    charPos.dateTime = new Date();
    charPos.direction = 'none';

    charPos.character = newChar;
    newChar.position = charPos;

    newChar.save();
    charPos.save();

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
    character.findOne({user:req.user._id, _id:req.param.id}).populate('position').run(function(err,docs){
        docs.remove();
        res.send('destroy character ' + req.params.id);
    });
};

exports.destroyAll = function(req, res){
    character.remove({user:req.user._id}, function(err,docs){
        res.send('destroy all characters');
    });
};

exports.select = function(req,res){
    character.findOne({user:req.user._id, name:req.params.name},function(err,docs){
        if(docs != null){
            req.session.selectedChar = docs;
            res.send('Selected character ' + req.params.name);
        }
        else{
            res.send('Character not found :' + req.params.name);
        }
    });
};


exports.current = function(req,res){
    character.findOne({user:req.user._id, _id:req.session.selectedChar._id}).populate('position').run(function(err,docs){
        if(!err){
            res.send(docs);
        }
        else{
            res.send(500);
        }
    });
};


exports.position = function(req,res){
    position.findOne({character:req.session.selectedChar._id},function(err,doc){
        if(doc != null){
            res.send(doc);
        }
        else{
            res.send('No character selected')
        }
    });
};