var mongoose = require('mongoose');
var async = require('async');
var character = mongoose.model('Character');
var redisFactory = require('../init/redisFactory.js')();
var staticClient;


exports.index = function(req, res){
    var client = GetRedisClient();

    var games = "Games";
    client.smembers(games,function(err,allGames){
        res.send(allGames);
    });
};
function merge_options(obj1){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    return obj3;
}

exports.characters = function(req, res){
    var client = GetRedisClient();
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
                    console.log('CHARS : '+chars);
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

                            charsToReturn.push(test);
                            callback();
                        });

                    }, function(err){
                        if(err){
                            console.log(err);
                            res.send(500);
                        }
                        else{
                            console.log(charsToReturn);
                            res.send(charsToReturn);
                        }
                    });
                }
            })
    });
};


exports.join = function(req,res){
    var bodyData = '';
    req.on('data', function (data) {
        bodyData += data;
    });
    req.on('end', function () {
        var input = JSON.parse(bodyData);

        if(!input.id){
            res.send(500);
        }
        else{
            var client = GetRedisClient();
            var charId = req.session.selectedChar._id;
            client.sadd("CharsInGame",charId, function(err,reply){

                if(reply === 0){
                    res.send(500);
                }
                else{
                    var games = "Games";
                    client.sadd(games,input.id);

                    var charName = "Char_"+charId;
                    client.set(charName,input.id);

                    var roomPlayers = "Game_"+input.id;
                    client.sadd(roomPlayers,charId);

                    var status = {
                        charId : charId,
                        x : 150,
                        y : 150,
                        dateTime : new Date().toISOString(),
                        direction : 'none'
                    };
                    var charStatus = "CharStatus_"+charId;
                    client.HMSET(charStatus,status,function(err,result){
                        console.log(result);
                    });

                    res.send(200);
                }
            });
        }

    });

};

exports.leave = function(req,res){
    var client = GetRedisClient();
    var charId = req.session.selectedChar._id;
    client.srem("CharsInGame",charId, function(err,reply){
        if(reply === 0){
            res.send(500);
        }
        else{
            var charName = "Char_"+charId;
            client.get(charName,function(err,gameId){
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
            });

            //TODO : StoreStats in Mongo?
        }
    });
};

var GetRedisClient = function(){
    staticClient = staticClient||redisFactory.CreateClient();
    return staticClient;
}
