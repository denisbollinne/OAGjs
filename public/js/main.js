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
    var allOtherChars = {};
    var updateCharacters = function(newPos){
       if(newPos.character !==currentCharId){
           var foundChar = allOtherChars[newPos.character]
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
    }

    Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {
            jQuery.get('/characters/current',function(currentPlayerInfo){
                currentCharId = currentPlayerInfo._id;
                var player = new GAME.player(gs,true,currentPlayerInfo.position).character;
                player.onPositionChanged = onPositionChanged;

                var enemy = new GAME.skeleton(gs).character;

                gs.addEntity(enemy);
                gs.addEntity(player);
            });
        }
    );
    var socket = io.connect('/');
    socket.on('updatedPosition', function (data) {
        updateCharacters(data);
    });
    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

