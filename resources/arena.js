var fs = require('fs');

var common = require('./commonControllersResources.js');

var arena = common.mongoose.model('Arena');

exports.index = function(req, res){
    arena.find({},function(err,docs){
        res.send(docs);
    })
};

exports.show = function(req, res){
    arena.findOne({name:req.params.name},function(err,doc){
        res.render('showArena',doc);
    })
};

exports.get = function(req, res){
    arena.findOne({name:req.params.name},function(err,doc){
        res.send(doc);
    })
};

exports.new = function(req, res){
    res.render('createArena');
};

exports.createInfo = function(req, res){
    arena.findOne({_id:req.body.id},function(err,arenaDoc){

        //arenaDoc.circleBoundingBoxes
        arenaDoc.name = req.body.name;
        arenaDoc.save();

        //This should probably return a jade page with the newly created char
        res.render('showArena',arenaDoc);
    });

};


exports.create = function(req, res){
    console.log(req.files.image);
    //Save image
    var newArena = new arena();
    newArena.name = 'tmp name';
    newArena.imagePath = req.files.image.path;
    newArena.save();

    var newPath = 'arenas/'+newArena._id;
    fs.rename(newArena.imagePath, newPath);

    newArena.imagePath = newPath;
    newArena.save();

    console.log('OK')
    res.send(200,newArena._id);
};