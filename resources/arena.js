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

exports.create = function(req, res){
    var newArena = new arena();
    newArena.name = req.body.name;
    newArena.imagePath = req.body.path;

    newArena.save();

    //This should probably return a jade page with the newly created char
    res.render('showArena',newArena);
};