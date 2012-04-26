/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 7/03/12
 * Time: 21:59
 */

GAME.Orb = function Orb(){

    var WALK_VX = 15;
    var vx = 0;
    var posx = 250;
    var p = new Sprite(["center", "bottom"], {
        "roll_forward": [["/img/orbs/orb1.jpg", 4],["/img/orbs/orb2.jpg", 4],["/img/orbs/orb3.jpg", 4],["/img/orbs/orb4.jpg", 4]],
        "roll_backward": [["/img/orbs/orb4.jpg", 4],["/img/orbs/orb3.jpg", 4],["/img/orbs/orb2.jpg", 4],["/img/orbs/orb1.jpg", 4]],
        "normal": [["/img/orbs/orb1.jpg", 1]]
    }, function(){
        p.action("normal")
    });

    this.update = function(){
        this.updateAnimation();
        p.update();
        posx += vx;
    };

    this.updateAnimation = function(){
        if(vx>=WALK_VX){
            p.action("roll_forward");
        }
        if(vx<=-WALK_VX){
            p.action("roll_backward");
        }
        if(vx === 0){
            p.action("normal");
        }
    };

    /*** input events stuff ***/
    this.keyDown_37 = function () {

        vx -= WALK_VX;
        this.updateAnimation();
    };

    this.keyUp_37 = this.keyUp_39 = function() {

        vx = 0;
        this.updateAnimation();
    };

    this.keyDown_39 = function () {

        vx += WALK_VX;
        this.updateAnimation();
    };

    this.draw = function(c) {
        p.draw(c, [posx,250]);
    }
};

