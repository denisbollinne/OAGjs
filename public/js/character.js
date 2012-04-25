/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */

GAME.Character = function Character(gs, animations, startPosition, isPlayable, hammer) {
    var WALK_VX = (1000 / GAME.framerate) / 20 * 5;
    var WALK_VY = (1000 / GAME.framerate) / 20 * 5;
    var vx = 0;
    var vy = 0;
    var isAttacking = false;
    var isHit = false;
    var isDead = false;
    var isDowned = false;
    var posx = startPosition[0];
    var posy = startPosition[1];
    var HP = 100;
    var diagonalSpeedDivider = 1.4142135;
    var spriteSize = 128;
    var halfSpriteSize = spriteSize / 2;
    var that = this;

    var p = new GAMEFW.Sprite(["center", "bottom"], animations, spriteSize, function () {
        p.action("standSouth");
    });

    var resetVelocityOnCollision = function(){
        if (that.triggersCollision(that, vx, vy)) {
            vx = 0;
            vy = 0;
        }
    };

    this.getZIndex = function () {
        return posy;
    };

    this.update = function () {

        if(isDead){
            return;
        }
        if (!that.triggersCollision(that, vx, vy)) {
            p.update();
            if (vx != 0 && vy != 0) {
                posx += vx / diagonalSpeedDivider;
                posy += vy / diagonalSpeedDivider;
            } else {
                posx += vx;
                posy += vy;
            }
        }
    };

    this.getBoundingBox = function () {
        return new GAME.BoundingBox(posx + 55, posy +80, 45, 35);
    };

    this.getBoundingSphere = function(){
        return new GAME.BoundingSphere(posx + 77, posy  + 97, 18);
    };

    this.triggersCollision = function (that, vx, vy) {
        //This is a stub, and will be used by collision detection
    };

    this.setDirection = function (movementState, direction) {
        if (movementState === 'walk') {
            if (direction === 'n') {
                vy = -WALK_VY;
                vx = 0;
            } else if (direction === 'ne') {
                vy = -WALK_VY;
                vx = WALK_VX;
            } else if (direction === 'nw') {
                vy = -WALK_VY;
                vx = -WALK_VX;
            } else if (direction === 's') {
                vy = WALK_VY;
                vx = 0;
            } else if (direction === 'se') {
                vy = WALK_VY;
                vx = WALK_VX;
            } else if (direction === 'sw') {
                vy = WALK_VY;
                vx = -WALK_VX;
            } else if (direction === 'e') {
                vx = WALK_VX;
                vy = 0;
            } else if (direction === 'w') {
                vx = -WALK_VX;
                vy = 0;
            }
        } else {
            vx = vy = 0;
        }

        that.updateanimation();
    };
    var previousX, previousY, previousDir, previousMovementState;
    this.setDirectionForNPC = function (x, y, direction, movementState, datetime) {
        if (direction != previousDir || x != previousX || y != previousY || movementState != previousMovementState) {
            posx = x;
            posy = y;
            previousX = x;
            previousY = y;
            previousDir = direction;
            previousMovementState = movementState;

            that.setDirection(movementState, direction);
        }
    };
    this.setHurted = function (NewHp) {
        isHit = true;
        if(!isDead){
            HP = NewHp;
        }
        if(HP <= 0 ){
            HP = 0;
            isDowned = true;
        }
        that.updateanimation();
    };

    this.triggerAttack = function () {
        isAttacking = true;
        that.updateanimation();
    };

    this.updateanimation = function () {
        var dir, movementState;

        resetVelocityOnCollision();

        if(isDead){
            return;
        }

        movementState = 'walk';
        var lastAction = p.get_action();
        if (isAttacking) {
            var attackAction = lastAction.toString().replace("stand", "attack");
            if (attackAction === lastAction) {
                isAttacking = false;
            } else {
                p.action(attackAction, true, function () {
                    var endAttack = p.get_action().toString().replace("attack", "stand");
                    p.action(endAttack);
                    isAttacking = false;
                });
            }
        }

        if (isHit && !isDowned) {
            var hitAction = lastAction.toString().replace("stand", "hit").replace("run","hit");
            if (hitAction === lastAction) {
                isHit = false;
            } else {
                p.action(hitAction, true, function () {
                    var endHit = p.get_action().toString().replace("hit", "stand");
                    p.action(endHit);
                    isHit = false;
                });
            }
        }

        if(isDowned){
            var dyingAction = lastAction.toString().replace("stand", "dying").replace("hit", "dying").replace("attack","dying");
            if (dyingAction === lastAction) {
                isDowned = false;
            }
            else{
                p.action(dyingAction,true, function(){
                    var deathAction = lastAction.toString().replace("stand", "death");
                    p.action(deathAction);
                    isDowned = false;
                    isDead = true;
                });
            }
        }

        if (vx >= WALK_VX) {
            if (vy >= WALK_VY) {
                p.action("runSouthEast");
                dir = 'se'
            } else if (vy <= -WALK_VY) {
                p.action("runNorthEast");
                dir = 'ne'
            } else {
                p.action("runEast");
                dir = 'e'
            }
        } else if (vx <= -WALK_VX) {
            if (vy >= WALK_VY) {
                p.action("runSouthWest");
                dir = 'sw'
            } else if (vy <= -WALK_VY) {
                p.action("runNorthWest");
                dir = 'nw'
            } else {
                p.action("runWest");
                dir = 'w'
            }
        } else if (vy >= WALK_VY) {
            p.action("runSouth");
            dir = 's'
        } else if (vy <= -WALK_VY) {
            p.action("runNorth");
            dir = 'n'
        } else {
            var standAction = lastAction.toString().replace("run", "stand");
            if (!isAttacking && !isHit && !isDead && !isDowned) {
                p.action(standAction);
            }
            movementState = 'stand'
        }

        if (isPlayable) {
            if (isAttacking) {
                that.performAttack({dateTime:Date.now()});
            } else if(!isDead && !isDowned) {
                that.onPositionChanged({x:posx, y:posy, direction:dir, movementState:movementState, dateTime:Date.now()})
            }
        }
    };
    this.onPositionChanged = function (data) {
    };
    this.performAttack = function (data) {
    };

    this.draw = function (c) {

        if(!isPlayable){
            c.fillStyle = "rgb(0,0,0)";
            c.fillRect (posx - 25  , posy - 128, 50, 3);
            c.fillStyle = "rgb(255,0,0)";
            c.fillRect (posx - 25 , posy - 128, (50 / 100) * HP, 3);
        }
        else{
            c.font = "20pt Calibri";
            c.fillText("HP : " + HP, 25,25)
        }
        p.draw(c, [posx, posy]);
    };


    if (isPlayable) {
        /*** input events stuff ***/
        this.keyUp_37 = this.keyUp_39 = function () {

            vx = 0;
            that.updateanimation();
        };

        this.keyDown_37 = function () {

            vx -= WALK_VX;
            that.updateanimation();
        };

        this.keyDown_39 = function () {

            vx += WALK_VX;
            that.updateanimation();
        };

        this.keyUp_38 = this.keyUp_40 = function () {

            vy = 0;
            that.updateanimation();
        };

        this.keyDown_38 = function () {

            vy -= WALK_VY;
            that.updateanimation();
        };

        this.keyDown_40 = function () {

            vy += WALK_VY;
            that.updateanimation();
        };

        this.keyDown_32 = function () {
            isAttacking = true;
            that.updateanimation();
        };

        //Todo remove this once collision detection works
        this.keyDown_72 = function () {
            isDowned = true;
            that.updateanimation();
        };

        var pointAngleCompareToP1 = function (p1, p2) {
            var angle = ( Math.atan2(p2.y - p1.y, p2.x - p1.x));
            return (angle >= 0 ? angle : (2 * Math.PI + angle)) * 360 / (2 * Math.PI)
        };

       hammer.ondragstart =  hammer.ondrag = function(ev) {
            that.processMouse(ev.position);
        };

        hammer.ondragend = function(p) {
            previousMouseDir = 'none';
            that.setDirection('stand');
        };


        var previousMouseDir = 'none';
        var directions = ['e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'];
        this.processMouse = function (mousePos) {

            var angle = pointAngleCompareToP1({x:posx, y:posy - halfSpriteSize }, mousePos);
            var rectifiedAngle = angle + 22
            if (rectifiedAngle > 360) {
                rectifiedAngle = rectifiedAngle - 360;
            }
            var direction = directions[Math.floor(rectifiedAngle / 45)];

            if (previousMouseDir != direction) {
                that.setDirection('walk', direction);
                previousMouseDir = direction;
            }
        }
    }
};

