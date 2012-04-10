var common = require('./commonControllersResources.js');

var character = common.mongoose.model('Character');
var client = common.redisClient;

var async = require('async');
var gameExpirencyInSecond = 60*60; //1H


var getCurrentGame = function(selectedChar,callback){
    if(selectedChar)
    {
        var charId = selectedChar._id;
        var charName = "Char_"+charId;
        client.get(charName,function(err,gameId){
            if(gameId){
                callback(gameId,200);
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
};

exports.index = function(req, res){
    getCurrentGame(req.session.selectedChar,function(gameId,code){
        var foundGame;
        if(code){
            foundGame = gameId;
        }
        var games = "Games";
        client.smembers(games,function(err,allGames){
            res.partial('partials/games',{games:allGames, currentGame:foundGame});
        });

    });

};

exports.characters = function(req, res){
    var gameId = req.params.id;
    var roomPlayers = "Game_"+gameId;
    client.smembers(roomPlayers,function(err,allCharsId){
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
                        var charStatus = "CharStatus_"+char._id;
                        client.HGETALL(charStatus,function(err,status){
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


exports.join = function(req,res){
    var input = req.body;
    if(!input.id){
        res.send(500);
    }
    else{
        var charId = req.session.selectedChar._id;
        var games = "Games";
        client.sadd(games,input.id);

        var charName = "Char_"+charId;
        client.get(charName,function(err,gameId){
            if(gameId){
                res.send(500);
            }else{
                client.setex(charName,gameExpirencyInSecond,input.id);

                var roomPlayers = "Game_"+input.id;
                client.sadd(roomPlayers,charId);

                var status = {
                    charId : charId,
                    x : 150,
                    y : 150,
                    dateTime : new Date().toISOString(),
                    direction : 'none',
                    HP : 100
                };
                var charStatus = "CharStatus_"+charId;
                client.HMSET(charStatus,status,function(err,result){
                    console.log(err);
                });

                res.send(200);
            }
        });
    }
};
exports.getCurrentGame = getCurrentGame;


exports.current = function(req,res){
    getCurrentGame(req.session.selectedChar,function(gameId,code){
        if(code){
            return res.send(gameId,code);
        }else{
            return res.send(gameId);
        }

    });
};
exports.leave = function(req,res){
    var charId = req.session.selectedChar._id;

    var charName = "Char_"+charId;
    client.get(charName,function(err,gameId){
        if(gameId){
            client.del(charName);
            var roomPlayers = "Game_"+gameId;
            client.srem(roomPlayers,charId);

            var charStatus = "CharStatus_"+charId;
            client.del(charStatus);

            client.scard(roomPlayers,function(err,count){
                if(count === 0){
                    var games = "Games";
                    client.srem(games,gameId);
                }
                res.send(200);
            });
        }else{
            res.send(500);
        }
    });
    //TODO : StoreStats in Mongo?
};
