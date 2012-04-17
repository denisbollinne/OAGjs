/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 14/03/12
 * Time: 17:48
 */

GAME.Player = function (gs,playable, currentPlayerInfo){

    var animations = new GAME.AnimationFactory();


    var knightAnimations = new GAME.Animations();
    var tileset = "/img/knight/tileSet.png";
    knightAnimations.runWest = new GAMEFW.AnimDef(tileset,2,12,276);
    knightAnimations.runEast = new GAMEFW.AnimDef(tileset,2,12,192);
    knightAnimations.runNorth = new GAMEFW.AnimDef(tileset,2,12,204);
    knightAnimations.runSouth = new GAMEFW.AnimDef(tileset,2,12,240);
    knightAnimations.runNorthWest = new GAMEFW.AnimDef(tileset,2,12,228);
    knightAnimations.runNorthEast = new GAMEFW.AnimDef(tileset,2,12,216);
    knightAnimations.runSouthWest = new GAMEFW.AnimDef(tileset,2,12,264);
    knightAnimations.runSouthEast =new GAMEFW.AnimDef(tileset,2,12,252);
    knightAnimations.standWest =new GAMEFW.AnimDef(tileset,2,1,379);
    knightAnimations.standEast =new GAMEFW.AnimDef(tileset,2,1,288);
    knightAnimations.standNorth =new GAMEFW.AnimDef(tileset,2,1,301);
    knightAnimations.standSouth =new GAMEFW.AnimDef(tileset,2,1,340);
    knightAnimations.standNorthWest = new GAMEFW.AnimDef(tileset,2,1,327);
    knightAnimations.standNorthEast =new GAMEFW.AnimDef(tileset,2,1,314);
    knightAnimations.standSouthWest =new GAMEFW.AnimDef(tileset,2,1,366);
    knightAnimations.standSouthEast =new GAMEFW.AnimDef(tileset,2,1,353);
    knightAnimations.attackWest =new GAMEFW.AnimDef(tileset,2,12,84);
    knightAnimations.attackNorth =new GAMEFW.AnimDef(tileset,2,12,12);
    knightAnimations.attackSouth =new GAMEFW.AnimDef(tileset,2,12,48);
    knightAnimations.attackNorthWest = new GAMEFW.AnimDef(tileset,2,12,36);
    knightAnimations.attackNorthEast =new GAMEFW.AnimDef(tileset,2,12,12);
    knightAnimations.attackSouthWest =new GAMEFW.AnimDef(tileset,2,12,72);
    knightAnimations.attackSouthEast =new GAMEFW.AnimDef(tileset,2,12,60);
    knightAnimations.attackEast =new GAMEFW.AnimDef(tileset,2,12,0);
    knightAnimations.hitWest =new GAMEFW.AnimDef(tileset,2,12,180);
    knightAnimations.hitNorth =new GAMEFW.AnimDef(tileset,2,12,108);
    knightAnimations.hitSouth =new GAMEFW.AnimDef(tileset,2,12,144);
    knightAnimations.hitNorthWest = new GAMEFW.AnimDef(tileset,2,12,132);
    knightAnimations.hitNorthEast =new GAMEFW.AnimDef(tileset,2,12,120);
    knightAnimations.hitSouthWest =new GAMEFW.AnimDef(tileset,2,12,168);
    knightAnimations.hitSouthEast =new GAMEFW.AnimDef(tileset,2,12,156);
    knightAnimations.hitEast =new GAMEFW.AnimDef(tileset,2,12,96);
    var startPosition = new Array();
    startPosition[0] = currentPlayerInfo.x;
    startPosition[1] = currentPlayerInfo.y;

    this.character = new GAME.Character(gs, knightAnimations, startPosition, playable);
};