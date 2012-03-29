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
       if(newPos.character !==currentCharId){
           var foundChar = allOtherChars[newPos.character];
           if(foundChar){
                foundChar.setDirection(newPos.x,newPos.y, newPos.direction, newPos.dateTime)
           }
           else{
               var newPlayer = new GAME.player(gs,false,newPos).character;
               allOtherChars[newPos.character] = newPlayer;
               gs.addEntity(newPlayer);
           }
       }
    };

    var onPositionChanged = function(data){
        socket.emit('updatePosition',data);
    };

    GAMEFW.Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {
            jQuery.get('/characters/current',function(currentPlayerInfo){
                currentCharId = currentPlayerInfo._id;
                var player = new GAME.player(gs,true,currentPlayerInfo.position).character;
                player.onPositionChanged = onPositionChanged;

               // var enemy = new GAME.skeleton(gs).character;

                //gs.addEntity(enemy);
                gs.addEntity(player);

                socket.on('updatedPosition', function (data) {
                    updateCharacters(data);
                });
            });
        }
    );
    var socket = io.connect('/');

    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

