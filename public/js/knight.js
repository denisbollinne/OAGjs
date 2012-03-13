/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Animations = function(Sprite){
    this.create = function(name, frames){
        var arr =[];
        for(var i = 0; i<frames;i++){
            var pad = "";
            if(i<10 ){
                pad = "0";
            }
            arr.push(["/img/" + name + "00" + pad + i + ".bmp",frames])
        }
    }
}

GAME.Knight = function Knight(gs){

    var anim = new GAME.Animations(gs);

    var WALK_VX = 15;
    var vx = 0;
    var posx = 250;
    var p = new Sprite(["center", "bottom"], {
        "run_right": anim.create("knight/running e",13),
        "run_left": anim.create("knight/running w",13),
        "normal": [["/img/knight/tipping over s0000.bmp", 1]]
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

