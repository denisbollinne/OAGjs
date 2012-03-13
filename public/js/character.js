/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Character = function Character(gs, animations){

    var anim = new GAME.AnimationFactory(gs);
    var WALK_VX = 5;
    var WALK_VY = 5;
    var vx = 0;
    var vy = 0;
    var posx = 250;
    var posy = 250;
    var p = new Sprite(["center", "bottom"], {
        "run_right": animations.runEast,
        "run_left": animations.runWest,
        "run_up": animations.runNorth,
        "run_down": animations.runSouth,
        "run_upRight": animations.runNorthEast,
        "run_upLeft": animations.runNorthWest,
        "run_downRight": animations.runSouthEast,
        "run_downLeft": animations.runSouthWest,
        "normal": [["/img/knight/tipping over s0000.jpg", 1],]
    }, function(){
        p.action("normal")
    });

    this.update = function(){
        this.updateanimation();
        p.update();
        if(vx != 0 && vy != 0) {
            posx += vx / 2;
            posy += vy / 2;
        }
        else {
            posx += vx;
            posy += vy;
        }
    };

    this.updateanimation = function(){
        if(vx>=WALK_VX){
            if(vy>=WALK_VY) {
                p.action("run_downRight");
            }
            else if(vy<=-WALK_VY){
                p.action("run_upRight");
            }
            else{
                p.action("run_right");
            }
        }
        else if(vx<=-WALK_VX){
            if(vy>=WALK_VY) {
                p.action("run_downLeft");
            }
            else if(vy<=-WALK_VY){
                p.action("run_upLeft");
            }
            else{
                p.action("run_left");
            }
        }
        else if(vy>=WALK_VY){
            p.action("run_down");
        }
        else if(vy<=-WALK_VY){
            p.action("run_up");
        }
        else {
            p.action("normal");
        }
    };

    /*** input events stuff ***/
    this.keyUp_37 = this.keyUp_39 = function() {

        vx = 0;
        this.updateanimation();
    };

    this.keyDown_37 = function () {

        vx -= WALK_VX;
        this.updateanimation();
    };

    this.keyDown_39 = function () {

        vx += WALK_VX;
        this.updateanimation();
    };

    this.keyUp_38 = this.keyUp_40 = function() {

        vy = 0;
        this.updateanimation();
    };

    this.keyDown_38 = function () {

        vy -= WALK_VY;
        this.updateanimation();
    };

    this.keyDown_40 = function () {

        vy += WALK_VY;
        this.updateanimation();
    };

    this.draw = function(c) {
        p.draw(c, [posx,posy]);
    }
};

