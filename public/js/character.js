/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Character = function Character(gs, animations, startPosition, isPlayable) {
    var WALK_VX = 5;
    var WALK_VY = 5;
    var vx = 0;
    var vy = 0;
    var isAttacking = false;
    var isHit = false;
    var posx = startPosition[0];
    var posy = startPosition[1];
    var HP = 100;
    var diagonalSpeedDivider =  1.4142135;

    var p = new GAMEFW.Sprite(["center", "bottom"], animations, 128, function () {
        p.action("standSouth");
    });

    this.GetZIndex = function(){
        return posy;
    };

    this.update = function () {
        p.update();
        if (vx != 0 && vy != 0) {
            posx += vx / diagonalSpeedDivider;
            posy += vy / diagonalSpeedDivider;
        }
        else {
            posx += vx;
            posy += vy;
        }
    };
    var previousX,previousY, previousDir, previousMovementState ;
    this.setDirection = function(x,y,direction,movementState,datetime){
        if(direction != previousDir || x != previousX || y != previousY || movementState != previousMovementState){
            posx = x;
            posy = y;
            previousX = x;
            previousY = y;
            previousDir = direction;
            previousMovementState = movementState;
            if(movementState ==='walk'){
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
                }
            }else{
                vx = vy=0;
            }

            this.updateanimation();
        }
    };
    this.setHurted = function(NewHp){
        isHit = true;
        HP = NewHp;
        this.updateanimation();
    };

    this.triggerAttack = function(){
        isAttacking = true;
        this.updateanimation();
    };

    this.updateanimation = function () {
        var dir,movementState;

        movementState = 'walk';
        var lastAction = p.get_action();
        if(isAttacking){
                var attackAction = lastAction.toString().replace("stand", "attack");
                if(attackAction === lastAction){
                    isAttacking = false;
                }
                else{
                    p.action(attackAction,true, function(){
                       var endAttack =  p.get_action().toString().replace("attack", "stand");
                       p.action(endAttack);
                        isAttacking = false;
                    });
                }
        }

        if(isHit){
            var hitAction = lastAction.toString().replace("stand", "hit");
            if(hitAction === lastAction){
                isHit = false;
            }
            else{
                p.action(hitAction,true, function(){
                    var endHit =  p.get_action().toString().replace("hit", "stand");
                    p.action(endHit);
                    isHit = false;
                });
            }
        }

            if (vx >= WALK_VX) {
                if (vy >= WALK_VY) {
                    p.action("runSouthEast");
                    dir = 'se'
                }
                else if (vy <= -WALK_VY) {
                    p.action("runNorthEast");
                    dir = 'ne'
                }
                else {
                    p.action("runEast");
                    dir = 'e'
                }
            }
            else if (vx <= -WALK_VX) {
                if (vy >= WALK_VY) {
                    p.action("runSouthWest");
                    dir = 'sw'
                }
                else if (vy <= -WALK_VY) {
                    p.action("runNorthWest");
                    dir = 'nw'
                }
                else {
                    p.action("runWest");
                    dir = 'w'
                }
            }
            else if (vy >= WALK_VY) {
                p.action("runSouth");
                dir = 's'
            }
            else if (vy <= -WALK_VY) {
                p.action("runNorth");
                dir = 'n'
            }
            else  {
                var standAction = lastAction.toString().replace("run", "stand");
                if(!isAttacking && !isHit){
                    p.action(standAction);
                }
                movementState = 'stand'
            }

        if(isPlayable){
            if(isAttacking){
                this.performAttack({dateTime:Date.now()});
            }else{
                this.onPositionChanged({x:posx,y:posy,direction:dir,movementState:movementState,dateTime:Date.now()})
            }
        }
    };
    this.onPositionChanged = function(data){};
    this.performAttack = function(data){};
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

        this.keyDown_32 = function(){
            isAttacking = true;
            this.updateanimation();
        };

        //Todo remove this once collision detection works
        this.keyDown_72 = function(){
            isHit = true;
            this.updateanimation();
        };
    }
};

