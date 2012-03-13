/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Character = function Character(gs, animations){

    var anim = new GAME.AnimationFactory(gs);
    var WALK_VX = 5;
    var vx = 0;
    var posx = 250;
    var p = new Sprite(["center", "bottom"], {
        "run_right": animations.runEast,
        "run_left": animations.runWest,
        "normal": [["/img/knight/tipping over s0000.bmp", 1],]
    }, function(){
        p.action("normal")
    });

    this.update = function(){
        this.updateanimation();
        p.update();
        posx += vx;
    };

    this.updateanimation = function(){
        if(vx>=WALK_VX){
            p.action("run_right");
        }
        if(vx<=-WALK_VX){
            p.action("run_left");
        }
        if(vx === 0){
            p.action("normal");
        }
    };

    /*** input events stuff ***/
    this.keyDown_37 = function () {

        vx -= WALK_VX;
        this.updateanimation();
    };

    this.keyUp_37 = this.keyUp_39 = function() {

        vx = 0;
        this.updateanimation();
    };

    this.keyDown_39 = function () {

        vx += WALK_VX;
        this.updateanimation();
    };

    this.draw = function(c) {
        p.draw(c, [posx,250]);
    }
};

