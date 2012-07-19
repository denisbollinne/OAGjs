define(['resources/commonControllersResources','async','resources/arena'],function(common,async,arenasController2){

    function gameController(){
        var arenasController = new arenasController2();

        var character = common.mongoose.model('Character');
        var arena = common.mongoose.model('Arena');

        var client = common.redisClient;
        var keyBuilder = common.redisKeyBuilder;

        var gameExpirencyInSecond = 60*60; //1H
        var that=this;
        function getCurrentGame (selectedChar,callback){
            if(selectedChar)
            {
                var charId = selectedChar._id;
                client.get(keyBuilder.charGameId(charId),function(err,gameId){
                    if(gameId){
                        client.get(keyBuilder.arenaForGame(gameId),function(err,arena){
                            callback({gameId:gameId,arena:arena},200);
                        });
                    }
                    else{
                        callback(200);
                    }
                });
            }
            else
            {
                callback(500);
            }
        }


    gameController.prototype.getCurrentGame = getCurrentGame;


    gameController.prototype.current = function(req,res){
        getCurrentGame(req.session.selectedChar,function(game,code){
            if(code){
                return res.send(game,code);
            }else{
                return res.send(game);
            }

        });
    };

        gameController.prototype.index = function(req, res){
            getCurrentGame(req.session.selectedChar,function(game,code){
                var foundGame;
                if(code){
                    foundGame = game.gameId;
                }
                client.smembers(keyBuilder.games(),function(err,allGames){
                    res.partial('partials/games',{games:allGames, currentGame:foundGame});
                });

            });

        };

        gameController.prototype.characters = function(req, res){
            var gameId = req.params.id;
            client.smembers(keyBuilder.playersInGame(gameId),function(err,allCharsId){
                character.find()
                    .where('_id')
                    .in(allCharsId)
                    .run(function(err,chars){
                        if(err){
                            console.log(err);
                            res.send(500);
                        }
                        else{
                            var charsToReturn = [];
                            async.forEach(chars,function (char, callback) {
                                client.HGETALL(keyBuilder.charStatus(char._id),function(err,status){
                                    var test = {};
                                    test.race  = char.race;
                                    test.class  = char.class;
                                    test.experience  = char.experience;
                                    test.name  = char.name;
                                    test.user  = char.user;
                                    test.position = status;
                                    test.position.x = parseInt(test.position.x);
                                    test.position.y = parseInt(test.position.y);

                                    charsToReturn.push(test);
                                    callback();
                                });

                            }, function(err){
                                if(err){
                                    console.log(err);
                                    res.send(500);
                                }
                                else{
                                    res.send(charsToReturn);
                                }
                            });
                        }
                    })
            });
        };


        gameController.prototype.join = function(req,res){
            var input = req.body;
            if(!input.id){
                res.send(500);
            }
            else{
                var charId = req.session.selectedChar._id;
                client.sadd(keyBuilder.games(),input.id);

                client.EXISTS(keyBuilder.charGameId(charId),function(err,exists){
                    if(exists){
                        res.send(200);
                    }else{
                        client.setex(keyBuilder.charGameId(charId),gameExpirencyInSecond,input.id);

                        client.sadd(keyBuilder.playersInGame(input.id),charId);
                        arenasController.getRandomArena(function(arena){
                            client.set(keyBuilder.arenaForGame(input.id),arena.name);
                            var status = {
                                charId : charId,
                                x : 512,
                                y : 393,
                                dateTime : new Date().toISOString(),
                                direction : 'none',
                                movementState : 'stand',
                                HP : 100
                            };
                            client.HMSET(keyBuilder.charStatus(charId),status,function(err,result){
                                console.log(err);
                            });

                            res.send(200);
                        });
                    }
                });
            }
        };

        gameController.prototype.leave = function(req,res){
            var charId = req.session.selectedChar._id;

            client.get(keyBuilder.charGameId(charId),function(err,gameId){
                if(gameId){
                    client.del(keyBuilder.charGameId(charId));
                    client.srem(keyBuilder.playersInGame(gameId),charId);

                    client.del(keyBuilder.charStatus(charId));

                    client.scard(keyBuilder.playersInGame(gameId),function(err,count){
                        if(count === 0){
                            client.srem(keyBuilder.games(),gameId);
                        }
                        res.send(200);
                    });
                }else{
                    res.send(500);
                }
            });
            //TODO : StoreStats in Mongo?
        };
    }
    return gameController;

});