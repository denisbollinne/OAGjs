/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 14/03/12
 * Time: 17:48
 */
define("player",['framework/animDef','character'],function(animDef,character){

    return function (gs,playable, currentPlayerInfo, arena , hammer){

        var knightAnimations = {};
        var tileset = "/img/knight/tileSet.png";
        knightAnimations.runWest = new animDef(tileset,2,12,276);
        knightAnimations.runEast = new animDef(tileset,2,12,192);
        knightAnimations.runNorth = new animDef(tileset,2,12,204);
        knightAnimations.runSouth = new animDef(tileset,2,12,240);
        knightAnimations.runNorthWest = new animDef(tileset,2,12,228);
        knightAnimations.runNorthEast = new animDef(tileset,2,12,216);
        knightAnimations.runSouthWest = new animDef(tileset,2,12,264);
        knightAnimations.runSouthEast =new animDef(tileset,2,12,252);
        knightAnimations.standWest =new animDef(tileset,2,1,379);
        knightAnimations.standEast =new animDef(tileset,2,1,288);
        knightAnimations.standNorth =new animDef(tileset,2,1,301);
        knightAnimations.standSouth =new animDef(tileset,2,1,340);
        knightAnimations.standNorthWest = new animDef(tileset,2,1,327);
        knightAnimations.standNorthEast =new animDef(tileset,2,1,314);
        knightAnimations.standSouthWest =new animDef(tileset,2,1,366);
        knightAnimations.standSouthEast =new animDef(tileset,2,1,353);
        knightAnimations.attackWest =new animDef(tileset,2,12,84);
        knightAnimations.attackNorth =new animDef(tileset,2,12,12);
        knightAnimations.attackSouth =new animDef(tileset,2,12,48);
        knightAnimations.attackNorthWest = new animDef(tileset,2,12,36);
        knightAnimations.attackNorthEast =new animDef(tileset,2,12,24);
        knightAnimations.attackSouthWest =new animDef(tileset,2,12,72);
        knightAnimations.attackSouthEast =new animDef(tileset,2,12,60);
        knightAnimations.attackEast =new animDef(tileset,2,12,0);
        knightAnimations.hitWest =new animDef(tileset,2,12,180);
        knightAnimations.hitNorth =new animDef(tileset,2,12,108);
        knightAnimations.hitSouth =new animDef(tileset,2,12,144);
        knightAnimations.hitNorthWest = new animDef(tileset,2,12,132);
        knightAnimations.hitNorthEast =new animDef(tileset,2,12,120);
        knightAnimations.hitSouthWest =new animDef(tileset,2,12,168);
        knightAnimations.hitSouthEast =new animDef(tileset,2,12,156);
        knightAnimations.hitEast =new animDef(tileset,2,12,96);
        knightAnimations.dyingWest =new animDef(tileset,8,13,379);
        knightAnimations.dyingNorth =new animDef(tileset,8,13,301);
        knightAnimations.dyingSouth =new animDef(tileset,8,13,340);
        knightAnimations.dyingNorthWest = new animDef(tileset,8,13,327);
        knightAnimations.dyingNorthEast =new animDef(tileset,8,13,314);
        knightAnimations.dyingSouthWest =new animDef(tileset,8,13,353);
        knightAnimations.dyingSouthEast =new animDef(tileset,8,13,366);
        knightAnimations.dyingEast =new animDef(tileset,8,13,288);
        knightAnimations.deathWest =new animDef(tileset,8,1,391);
        knightAnimations.deathNorth =new animDef(tileset,8,1,313);
        knightAnimations.deathSouth =new animDef(tileset,8,1,352);
        knightAnimations.deathNorthWest = new animDef(tileset,8,1,339);
        knightAnimations.deathNorthEast =new animDef(tileset,8,1,326);
        knightAnimations.deathSouthWest =new animDef(tileset,8,1,365);
        knightAnimations.deathSouthEast =new animDef(tileset,8,1,378);
        knightAnimations.deathEast =new animDef(tileset,8,1,300);
        var startPosition = new Array();
        startPosition[0] = currentPlayerInfo.x;
        startPosition[1] = currentPlayerInfo.y;

        this.character = new character(gs, knightAnimations, startPosition, playable, arena, hammer);
    };
});