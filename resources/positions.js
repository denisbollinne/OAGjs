define(['resources/commonControllersResources','async'],function(common,async){

    function positionController(){
        var client = common.redisClient;
        var keyBuilder = common.redisKeyBuilder;

        function charactersCollide(currentChar, targetChar,attack){
            var attackRange = attack.range;
            var attackAngle = attack.angle;
            var direction = currentChar.direction;
            var rangeBetweenPlayers =computeDistanceBetweenTwoPoints(currentChar,targetChar);
            if(rangeBetweenPlayers <= attackRange){
                var newRotationAngle = getRotationAngleForDirection(direction);
                var targetPointAngle = pointAngleCompareToP1(currentChar,targetChar);

                var targetPointAngleWithNewRotationAngle = targetPointAngle - newRotationAngle+ (attackAngle/2);
                if(targetPointAngleWithNewRotationAngle >= 0 && targetPointAngleWithNewRotationAngle< attackAngle){
                    return true;
                }
            }
            return false;
        };

        function pointAngleCompareToP1(p1,p2){
            var angle = ( Math.atan2(p2.y - p1.y,p2.x - p1.x));
            return (angle >= 0 ? angle : (2*Math.PI + angle)) * 360 / (2*Math.PI)
        };

        function computeDistanceBetweenTwoPoints(p1,p2){
            return Math.sqrt(Math.pow(p2.x - p1.x,2) + Math.pow(p2.y - p1.y,2))
        };

        function getRotationAngleForDirection(direction){
            if(direction === 'e')return 0;
            if(direction === 'se')return 45;
            if(direction === 's')return 90;
            if(direction === 'sw')return 135;
            if(direction === 'w')return 180;
            if(direction === 'nw')return 225;
            if(direction === 'n')return 270;
            if(direction === 'ne')return 315;
        };


        positionController.prototype.updateSio = function(session, data,callback){
            if(session.selectedChar){
                var charId = session.selectedChar._id;

                client.get(keyBuilder.charGameId(charId),function(err,gameId){
                    client.hgetall(keyBuilder.charStatus(charId),function(err,status){
                        var newPos = data;
                        status.x = newPos.x;
                        status.y = newPos.y;
                        if(newPos.direction){
                            status.direction = newPos.direction;
                        }
                        status.dateTime = newPos.dateTime;
                        status.movementState = newPos.movementState;
                        client.hmset(keyBuilder.charStatus(charId),status);
                        callback(true,status,gameId);
                    })
                });
            }
            else{
                callback(false);
            }
        };
        positionController.prototype.performAttack = function(session, data,callback){
            var attackHP = 20;
            var attackRange = 60;
            var attackAngle = 45;

            if(session.selectedChar){
                var currentCharId = session.selectedChar._id;

                client.get(keyBuilder.charGameId(currentCharId),function(err,gameId){

                    client.hgetall(keyBuilder.charStatus(currentCharId),function(err,currentCharPosition){
                        client.SMEMBERS(keyBuilder.playersInGame(gameId),function(err,allCharsInGame){
                            var hitCharactersAndHowItAffectTheUi = [];
                            async.forEach(allCharsInGame,function (charId, foreachCallback) {
                                if(charId !== currentCharId){
                                    client.hgetall(keyBuilder.charStatus(charId),function(err,status){
                                        if(charactersCollide(currentCharPosition,status,{range : attackRange, angle : attackAngle})) {
                                            status.HP = status.HP - attackHP;
                                            client.hmset(keyBuilder.charStatus(charId),status);
                                            //TODO : not send all status to the UI
                                            hitCharactersAndHowItAffectTheUi.push(status);
                                            foreachCallback();
                                        }
                                        else{
                                            foreachCallback();
                                        }
                                    });
                                }else{
                                    foreachCallback();
                                }

                            }, function(err){
                                if(err){
                                    console.log(err);
                                    res.send(500);
                                }
                                else{
                                    callback(true,{attackingChar : currentCharId, hurtedChars : hitCharactersAndHowItAffectTheUi},gameId);
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

    };

    return positionController;
});