/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 14/03/12
 * Time: 17:48
 */

GAME.player = function (gs,playable, currentPlayerInfo){

    var animations = new GAME.AnimationFactory();


    var knightAnimations = new GAME.Animations();
    knightAnimations.runWest = animations.createAnimations("knight/running w",12,2);
    knightAnimations.runEast = animations.createAnimations("knight/running e",12,2);
    knightAnimations.runNorth = animations.createAnimations("knight/running n",12,2);
    knightAnimations.runSouth = animations.createAnimations("knight/running s",12,2);
    knightAnimations.runNorthWest = animations.createAnimations("knight/running nw",12,2);
    knightAnimations.runNorthEast = animations.createAnimations("knight/running ne",12,2);
    knightAnimations.runSouthWest = animations.createAnimations("knight/running sw",12,2);
    knightAnimations.runSouthEast = animations.createAnimations("knight/running se",12,2);
    knightAnimations.standWest = animations.createAnimations("knight/tipping over w",1,2);
    knightAnimations.standEast = animations.createAnimations("knight/tipping over e",1,2);
    knightAnimations.standNorth = animations.createAnimations("knight/tipping over n",1,2);
    knightAnimations.standSouth = animations.createAnimations("knight/tipping over s",1,2);
    knightAnimations.standNorthWest = animations.createAnimations("knight/tipping over nw",1,2);
    knightAnimations.standNorthEast = animations.createAnimations("knight/tipping over ne",1,2);
    knightAnimations.standSouthWest = animations.createAnimations("knight/tipping over sw",1,2);
    knightAnimations.standSouthEast = animations.createAnimations("knight/tipping over se",1,2);
    var startPosition = new Array();
    startPosition[0] = currentPlayerInfo.x;
    startPosition[1] = currentPlayerInfo.y;

    this.character = new GAME.Character(gs, knightAnimations, startPosition, playable);
}