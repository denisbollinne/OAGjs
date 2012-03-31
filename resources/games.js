var mongoose = require('mongoose');

var redisFactory = require('../init/redisFactory.js')();
var staticClient;


exports.index = function(req, res){
    var client = GetRedisClient();

    var games = "Games";
    client.smembers(games,function(err,allGames){
        res.send(allGames);
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
                        dateTime : new Date(),
                        direction : 'none'
                    };
                    var charStatus = "CharStatus_"+charId;
                    client.hmset(charStatus,status);

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
