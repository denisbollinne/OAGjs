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
    animations.appendImages(imagesToPreload, "knight/running e",10);
    animations.appendImages(imagesToPreload, "knight/running w",10);
    imagesToPreload.push("/img/knight/tipping over s0000.bmp");
    Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {

            var knightAnimations = new GAME.Animations();
            knightAnimations.runWest = animations.createAnimations("knight/running w",11);
            knightAnimations.runEast = animations.createAnimations("knight/running e",11);
            var knight = new GAME.Character(gs, knightAnimations);
            gs.addEntity(knight);
        }
    );
    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

