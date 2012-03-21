/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Character = function Character(gs, animations, startPosition, isPlayable) {
    var updateUrl = "/positions"
    var anim = new GAME.AnimationFactory();
    var WALK_VX = 5;
    var WALK_VY = 5;
    var vx = 0;
    var vy = 0;
    var posx = startPosition[0];
    var posy = startPosition[1];

    var p = new Sprite(["center", "bottom"], {
        "run_right":animations.runEast,
        "run_left":animations.runWest,
        "run_up":animations.runNorth,
        "run_down":animations.runSouth,
        "run_upRight":animations.runNorthEast,
        "run_upLeft":animations.runNorthWest,
        "run_downRight":animations.runSouthEast,
        "run_downLeft":animations.runSouthWest,
        "stand_right":animations.standEast,
        "stand_left":animations.standWest,
        "stand_up":animations.standNorth,
        "stand_down":animations.standSouth,
        "stand_upRight":animations.standNorthEast,
        "stand_upLeft":animations.standNorthWest,
        "stand_downRight":animations.standSouthEast,
        "stand_downLeft":animations.standSouthWest
    }, function () {
        p.action("stand_down")
    });

    this.update = function () {
        p.update();
        if (vx != 0 && vy != 0) {
            posx += vx / 2;
            posy += vy / 2;
        }
        else {
            posx += vx;
            posy += vy;
        }
    };
    var previousX,previousY, previousDir ;
    this.setDirection = function(x,y,direction,datetime){
        if(direction != previousDir || x != previousX || y != previousY){
            posx = x;
            posy = y;
            previousX = x;
            previousY = y;
            previousDir = direction;
            if(direction === 'n'){
                vy = -WALK_VY;
                vx = 0;
            }else if(direction === 'ne'){
                vy = -WALK_VY;
                vx = WALK_VX;
            }else if(direction === 'nw'){
                vy = -WALK_VY;
                vx = -WALK_VX;
            }else if(direction === 's'){
                vy = WALK_VY;
                vx = 0;
            }else if(direction === 'se'){
                vy = WALK_VY;
                vx = WALK_VX;
            }else if(direction === 'sw'){
                vy = WALK_VY;
                vx = -WALK_VX;
            }else if(direction === 'e'){
                vx = WALK_VX;
                vy = 0;
            }else if(direction === 'w'){
                vx = -WALK_VX;
                vy = 0;
            } else{
                vx = vy=0;
            }

            this.updateanimation();
        }
    }

    this.updateanimation = function () {
        var dir;
        if (vx >= WALK_VX) {
            if (vy >= WALK_VY) {
                p.action("run_downRight");
                dir = 'se'
            }
            else if (vy <= -WALK_VY) {
                p.action("run_upRight");
                dir = 'ne'
            }
            else {
                p.action("run_right");
                dir = 'e'
            }
        }
        else if (vx <= -WALK_VX) {
            if (vy >= WALK_VY) {
                p.action("run_downLeft");
                dir = 'sw'
            }
            else if (vy <= -WALK_VY) {
                p.action("run_upLeft");
                dir = 'nw'
            }
            else {
                p.action("run_left");
                dir = 'w'
            }
        }
        else if (vy >= WALK_VY) {
            p.action("run_down");
            dir = 's'
        }
        else if (vy <= -WALK_VY) {
            p.action("run_up");
            dir = 'n'
        }
        else {
            var lastAction = p.get_action();
            var newAction = lastAction.toString().replace("run", "stand");
            p.action(newAction);
            dir = 'none'
        }
        if(isPlayable){
            jQuery.ajax({
                type: 'PUT',
                url: '/positions',
                data: {x:posx,y:posy,direction:dir,dateTime:Date.now()},
                dataType: 'json'
            });
        }
    };

    this.draw = function (c) {
        p.draw(c, [posx, posy]);
    };

    if (isPlayable) {
        /*** input events stuff ***/
        this.keyUp_37 = this.keyUp_39 = function () {

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

        this.keyUp_38 = this.keyUp_40 = function () {

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
    }


};

