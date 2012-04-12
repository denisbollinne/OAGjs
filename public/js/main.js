/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 7/03/12
 * Time: 21:51
 */
GAME = {};

GAME.startGame = function(){
    var animations = new GAME.AnimationFactory();

    var imagesToPreload = [];
    imagesToPreload.push("/img/knight/tileSet.png");
    var currentCharId;
    var allOtherChars = {};
    var updateCharacters = function(newPos){
       if(newPos.charId !==currentCharId){
           var foundChar = allOtherChars[newPos.charId];
           if(foundChar){
                foundChar.setDirection(newPos.x,newPos.y, newPos.direction, newPos.movementState,newPos.dateTime)
           }
           else{
               var newPlayer = new GAME.player(gs,false,newPos).character;
               allOtherChars[newPos.charId] = newPlayer;
               gs.addEntity(newPlayer);
           }
       }
    };

    var triggerAttach = function(attackingCharId,hurtedCharsStatus){
        var foundChar = allOtherChars[attackingCharId];
        if(foundChar){
            foundChar.triggerAttack();
        }
    };

    var onPositionChanged = function(data){
        socket.emit('updatePosition',data);
    };

    var performAttack = function(data){
        socket.emit('performAttack',data);
    };

    var socket = io.connect('/');
    socket.on('connect',function(){
        GAMEFW.Sprite.preload(imagesToPreload,
            // when the sprites are loaded, create the world
            function() {
                jQuery.get('/characters/current',function(currentPlayerInfo){
                    var gameId = currentPlayerInfo.game;
                    currentCharId = currentPlayerInfo.character._id;
                    var player = new GAME.player(gs,true,currentPlayerInfo.character.position).character;
                    player.onPositionChanged = onPositionChanged;
                    player.performAttack = performAttack;

                   // var enemy = new GAME.skeleton(gs).character;

                    //gs.addEntity(enemy);
                    gs.addEntity(player);

                    socket.on('updatedPosition', function (data) {
                        updateCharacters(data);
                    });
                    socket.on('attackPerformed', function(data){
                        triggerAttach(data.attackingChar,data.hurtedChars);
                    });
                });
            }
        );
    });


    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

