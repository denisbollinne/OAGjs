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

        arenaDoc.name = req.body.name;

        //arenaDoc.circleBoundingBoxes
        arenaDoc.save();

        //This should probably return a jade page with the newly created char
        res.render('showArena',arenaDoc);
    });

};


exports.create = function(req, res){
   // console.log(req.body);
    //Save image
    var newArena = new arena();
    newArena.name = 'tmpName';
    newArena.save();

    res.send(200,newArena._id);
};