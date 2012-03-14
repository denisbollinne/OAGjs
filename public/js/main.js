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

    Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {

            var player = new GAME.player(gs);
            var enemy = new GAME.skeleton(gs);

            gs.addEntity(enemy.character);
            gs.addEntity(player.character);
        }
    );
    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

