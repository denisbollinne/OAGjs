var fs = require('fs');

var common = require('./commonControllersResources.js');

var arena = common.mongoose.model('Arena');

exports.index = function (req, res) {
    arena.find({}, function (err, docs) {
        res.send(docs);
    })
};

exports.show = function (req, res) {
    arena.findOne({name:req.params.name}, function (err, doc) {
        res.render('showArena', doc);
    })
};

exports.get = function (req, res) {
    arena.findOne({name:req.params.name}, function (err, doc) {
        res.send(doc);
    })
};

exports.new = function (req, res) {
    res.render('createArena');
};

exports.create = function (req, res) {
    var body = JSON.parse(req.body.data);
    //Save image
    var newArena = new arena();
    newArena.name = body.name;
    newArena.imagePath = req.files.image.path;
    newArena.save();

    var newPath = '/img/arenas/' + newArena._id;

    newArena.save();

    fs.rename(req.files.image.path, __dirname + '/../public' + newPath, function (err) {
        if (err) {
            throw err;
        }

        fs.unlink(req.files.image.path, function (err) {

            newArena.imagePath = newPath;

            body.boundingBoxes.forEach(function (b) {
                if (b.r) {
                    newArena.circleBoundingBoxes.push(b);
                } else {
                    newArena.rectangleBoundingBoxes.push(b);
                }
            });

            newArena.save();

            res.send(200);  //res.render('showArena', newArena);
        });

    });

};
var deleteArena = function(arena){
    if (arena) {
        fs.unlink(__dirname + '/../public' + arena.imagePath, function (err) {

            arena.remove();
        });
    }
};
exports.delete = function (req, res) {
    arena.findOne({_id:req.params.id}, function (err, arena) {
        deleteArena(arena);

        res.send(200);
    });
};

exports.deleteAll = function (req, res) {
    arena.find({},function(err,arenas){
        arenas.forEach(function(arena){
            deleteArena(arena);
            arena.remove();
        });
        res.send(200);
    });


};