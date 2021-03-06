define(['resources/commonControllersResources'],function(common){

    function characterController(){

        character = common.mongoose.model('Character');
        client = common.redisClient;
        var keyBuilder = common.redisKeyBuilder;

        characterController.prototype.all = function(req, res){
            character.find({}).populate('position',function(err,docs){
                res.send(docs);
            })
        };

        characterController.prototype.new = function(req, res){
            //SEND new character html page
           // res.send(jadePage);
        };

        characterController.prototype.create = function(req, res){
            var newChar = new character();
            newChar.user = req.user;
            newChar.name = req.body.name
            newChar.experience = 0;
            newChar.class = req.body.class;
            newChar.race = req.body.race;

            newChar.save();


           //characterController.prototype should probably return a jade page with the newly created char
            res.send(200);
        };

        characterController.prototype.show = function(req, res){
            res.send('show character ' + req.params.id);
        };

        characterController.prototype.edit = function(req, res){
            res.send('edit character ' + req.params.id);
        };

        characterController.prototype.update = function(req, res){
            res.send('update character ' + req.params.id);
        };
        //SHOULD BE A POST
        characterController.prototype.destroy = function(req, res){
            character.findOne({user:req.user._id, _id:req.param.id}).populate('position',function(err,docs){
                docs.remove();
                res.send('destroy character ' + req.params.id);
            });
        };
        //SHOULD BE A POST
        characterController.prototype.destroyAll = function(req, res){
            character.remove({user:req.user._id}, function(err,docs){
                res.send('destroy all characters');
            });
        };

        //SHOULD BE A POST
        characterController.prototype.select = function(req,res){
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


        characterController.prototype.current = function(req,res){
            if(req.session.selectedChar){
                character.findOne({user:req.user._id, _id:req.session.selectedChar._id},function(err,char){
                if(!err){
                    client.HGETALL(keyBuilder.charStatus(char._id),function(err,status){
                        if(err){
                            console.log('ERROR : '+err);
                            res.send(char);
                        } else{
                            client.get(keyBuilder.charGameId(char._id),function(err,gameId){
                                var test = {};
                                test._id = char._id;
                                test.race  = char.race;
                                test.class  = char.class;
                                test.experience  = char.experience;
                                test.name  = char.name;
                                test.user  = char.user;
                                test.position = status;
                                test.position.x = parseInt(test.position.x);
                                test.position.y = parseInt(test.position.y);

                                res.send({game:gameId,character:test});
                            });
                        }
                    });
                }
                else{
                    res.send(500);
                }
            });
            }
        };


        characterController.prototype.position = function(req,res){
            position.findOne({character:req.session.selectedChar._id},function(err,doc){
                if(doc != null){
                    res.send(doc);
                }
                else{
                    res.send('No character selected')
                }
            });
        };

        characterController.prototype.index = function(req, res){
            character.find({user:req.user._id},function(err,docs){
                res.render('partials/character',{characters : docs});
            });
        };
    };
    return characterController;
});