var common = require('./commonControllersResources.js');
var client = common.redisClient;

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