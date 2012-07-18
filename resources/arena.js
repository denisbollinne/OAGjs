define(['fs','resources/commonControllersResources'],function(fs,common){

    return function(){
        var arena = common.mongoose.model('Arena');


        this.index = function (req, res) {
            arena.find({}, function (err, docs) {
                res.send(docs);
            })
        };

        this.show = function (req, res) {
            arena.findOne({name:req.params.name}, function (err, doc) {
                res.render('showArena', doc);
            })
        };

        this.get = function (req, res) {
            arena.findOne({name:req.params.name}, function (err, doc) {
                res.send(doc);
            })
        };

        this.new = function (req, res) {
            res.render('createArena');
        };

        var hasWhiteSpace = function hasWhiteSpace(s) {
            return /\s/g.test(s);
        };

        this.create = function (req, res) {
            var body = JSON.parse(req.body.data);
            //Save image
            var newArena = new arena();
            newArena.name = body.name;
            if(hasWhiteSpace(newArena.name)){
                res.send('invalid name, name shouldn\'t contain any spaces');
            }
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
        this.delete = function (req, res) {
            arena.findOne({_id:req.params.id}, function (err, arena) {
                deleteArena(arena);

                res.send(200);
            });
        };

        this.deleteAll = function (req, res) {
            arena.find({},function(err,arenas){
                arenas.forEach(function(arena){
                    deleteArena(arena);
                    arena.remove();
                });
                res.send(200);
            });
        };

        var getRandomArena = function(callback){
            arena.count(function(err,countOfArena){
                var arenaNumber = Math.floor((Math.random()*countOfArena));
                arena.find({}).skip(arenaNumber).limit(1).exec(function (err, doc) {
                    callback(doc[0]);
                });
            })
        };

        this.getRandomArena = getRandomArena;

        this.getRandom = function(req,res){
            getRandomArena(function(arena){
                res.send(arena);
            })
        };
    };
});