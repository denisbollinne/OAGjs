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
    imagesToPreload.push("/img/knight/tipping over s0000.jpg");
    Sprite.preload(imagesToPreload,
        // when the sprites are loaded, create the world
        function() {

            var knightAnimations = new GAME.Animations();
            knightAnimations.runWest = animations.createAnimations("knight/running w",12,2);
            knightAnimations.runEast = animations.createAnimations("knight/running e",12,2);
            knightAnimations.runNorth = animations.createAnimations("knight/running n",12,2);
            knightAnimations.runSouth = animations.createAnimations("knight/running s",12,2);
            knightAnimations.runNorthWest = animations.createAnimations("knight/running nw",12,2);
            knightAnimations.runNorthEast = animations.createAnimations("knight/running ne",12,2);
            knightAnimations.runSouthWest = animations.createAnimations("knight/running sw",12,2);
            knightAnimations.runSouthEast = animations.createAnimations("knight/running se",12,2);
            var knight = new GAME.Character(gs, knightAnimations);
            gs.addEntity(knight);
        }
    );
    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

