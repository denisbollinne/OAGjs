var common = require('./commonControllersResources.js');
var client = common.redisClient;
var async = require('async');

exports.updateSio = function(session, data,callback){
    if(session.selectedChar){
        var charId = session.selectedChar._id;

        var charName = "Char_"+charId;
        client.get(charName,function(err,gameId){
            var charStatus = "CharStatus_"+charId;
            client.hgetall(charStatus,function(err,status){
                var newPos = data;
                status.x = newPos.x;
                status.y = newPos.y;
                status.direction = newPos.direction;
                status.dateTime = newPos.dateTime;
                client.hmset(charStatus,status);
                callback(true,status,gameId);
            })
        });
    }
    else{
        callback(false);
    }
};

exports.performAttack = function(session, data,callback){
    var attackHP = 20;
    var attackRange = 50;
    var attackAngle = 45;

    if(session.selectedChar){
        var currentCharId = session.selectedChar._id;

        var charName = "Char_"+currentCharId;
        client.get(charName,function(err,gameId){

            var charStatus = "CharStatus_"+charId;
            client.hgetall(charStatus,function(err,currentCharPosition){
                var roomPlayers = "Game_"+gameId;
                client.SMEMBERS(roomPlayers,function(err,allCharsInGame){
                    var hitCharactersAndHowItAffectTheUi = [];
                    async.forEach(allCharsInGame,function (charId, foreachCallback) {
                        var charStatus = "CharStatus_"+charId;
                        client.hgetall(charStatus,function(err,status){
                            if(charactersCollide(currentCharPosition,status,{range : attackRange, angle : attackAngle})) {
                                status.HP = status.HP - attackHP;
                                client.hmset(charStatus,status);

                                //TODO : not send all status to the UI
                                hitCharactersAndHowItAffectTheUi.push(status)
                            }
                            foreachCallback();
                        })
                    }, function(err){
                        if(err){
                            console.log(err);
                            res.send(500);
                        }
                        else{
                            res.send(hitCharactersAndHowItAffectTheUi);
                        }
                    });
                });
            });


        });
        //TODO : log to stats
    }
    else{
        callback(false);
    }
};

var charactersCollide = function(currentChar, targetChar,attack){
    var attackRange = attack.range;
    var attackAngle = attack.angle;
    var direction = currentChar.direction;

    //TODO : implement
    return false;
}