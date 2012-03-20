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
    animations.appendImages(imagesToPreload, "knight/running e",12);
    animations.appendImages(imagesToPreload, "knight/running w",12);
    animations.appendImages(imagesToPreload, "knight/running n",12);
    animations.appendImages(imagesToPreload, "knight/running s",12);
    animations.appendImages(imagesToPreload, "knight/running ne",12);
    animations.appendImages(imagesToPreload, "knight/running nw",12);
    animations.appendImages(imagesToPreload, "knight/running se",12);
    animations.appendImages(imagesToPreload, "knight/running sw",12);
    animations.appendImages(imagesToPreload, "knight/tipping over e",6);
    animations.appendImages(imagesToPreload, "knight/tipping over w",6);
    animations.appendImages(imagesToPreload, "knight/tipping over n",6);
    animations.appendImages(imagesToPreload, "knight/tipping over s",6);
    animations.appendImages(imagesToPreload, "knight/tipping over ne",6);
    animations.appendImages(imagesToPreload, "knight/tipping over nw",6);
    animations.appendImages(imagesToPreload, "knight/tipping over se",6);
    animations.appendImages(imagesToPreload, "knight/tipping over sw",6);
    animations.appendImages(imagesToPreload, "knight/attack e",12);
    animations.appendImages(imagesToPreload, "knight/attack w",12);
    animations.appendImages(imagesToPreload, "knight/attack n",12);
    animations.appendImages(imagesToPreload, "knight/attack s",12);
    animations.appendImages(imagesToPreload, "knight/attack ne",12);
    animations.appendImages(imagesToPreload, "knight/attack nw",12);
    animations.appendImages(imagesToPreload, "knight/attack se",12);
    animations.appendImages(imagesToPreload, "knight/attack sw",12);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt e",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt w",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt n",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt s",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt ne",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt nw",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt se",9);
    animations.appendImages(imagesToPreload, "skeleton/skel rennt sw",9);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen e",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen w",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen n",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen s",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen ne",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen nw",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen se",1);
    animations.appendImages(imagesToPreload, "skeleton/macht faxen sw",1);

    var currentCharId;
    var allOtherChars = [];
    var updateCharacters = function(){
        jQuery.get('/positions',function(allPositions){
           for(var i = 0; i<allPositions.length ;i+=1){
               var newPos = allPositions[i];
               if(newPos.character !==currentCharId){
                   var doesNotExist = true;
                    for(var j = 0; j<allOtherChars.length ; j+=1){
                        var foundChar = allOtherChars[j];
                        if(newPos.character === foundChar.id){
                            doesNotExist = false;
                            foundChar.character.setDirection(newPos.x,newPos.y, newPos.direction, newPos.dateTime)
                        }
                    }
                   if(doesNotExist){
                       var newPlayer = new GAME.player(gs,false,newPos).character;
                       allOtherChars.push({character:newPlayer,id:newPos.character});
                       gs.addEntity(newPlayer);
                   }
               }
           }
        });
    }
    Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {
            jQuery.get('/characters/current',function(currentPlayerInfo){
                currentCharId = currentPlayerInfo._id;
                var player = new GAME.player(gs,true,currentPlayerInfo.position);
                var enemy = new GAME.skeleton(gs);

                gs.addEntity(enemy.character);
                gs.addEntity(player.character);

                setInterval(updateCharacters,200);
            });
        }
    );
    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

