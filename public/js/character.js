/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 11/03/12
 * Time: 19:48
 */
define('character',['settings','framework/sprite','characterAction','particleEffect'],function(settings,sprite,characterAction,particleEffect){

    return function (gs, animations, startPosition, isPlayable, arena,  hammer) {
        var WALK_VX = (1000 / settings.framerate) / 20 * 5;
        var WALK_VY = (1000 /settings.framerate) / 20 * 5;
        var vx = 0;
        var vy = 0;
        var characterAnimations = new characterAction(WALK_VX, WALK_VY);
        this.posx = startPosition[0];
        this.posy = startPosition[1];

        var HP = 100;
        var diagonalSpeedDivider = 1.4142135;
        var spriteSize = 128;
        var halfSpriteSize = spriteSize / 2;
        var that = this;
        that.arenaGetter = arena;

        var p = new sprite(["center", "bottom"], animations, spriteSize, function () {
            p.action("standSouth");
        });


        this.getRelativePosX = function(){
            return that.posx - that.arenaGetter().getXOffset();
        };

        this.getRelativePosY = function(){
            return that.posy - that.arenaGetter().getYOffset();
        };

        var resetVelocityOnCollision = function(){
            if (that.triggersCollision(that, vx, vy)) {
                vx = 0;
                vy = 0;
            }
        };

        this.getZIndex = function () {
            return that.posy;
        };

        this.update = function () {
            var arena = that.arenaGetter();
            if(characterAnimations.isAlive()){
                if (arena.areCoordinatesInArena({x: that.posx + vx, y: that.posy + vy}) && !that.triggersCollision(that, vx, vy) ) {
                    p.update();
                    if (vx != 0 && vy != 0) {
                        that.posx += vx / diagonalSpeedDivider;
                        that.posy += vy / diagonalSpeedDivider;
                    } else {
                        that.posx += vx;
                        that.posy += vy;
                    }
                }
            }
        };

        this.getBoundingBox = function () {
            return new GAME.BoundingBox(that.posx , that.posy - 30 , 45, 35);
        };

        this.getBoundingSphere = function(){
            return new GAME.BoundingSphere(that.posx , that.posy -30, 18);
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

            that.updateAnimation();
        };
        var previousX, previousY, previousDir, previousMovementState;
        this.setDirectionForNPC = function (x, y, direction, movementState, datetime) {
            if (direction != previousDir || x != previousX || y != previousY || movementState != previousMovementState) {
                that.posx = x;
                that.posy = y;
                previousX = x;
                previousY = y;
                previousDir = direction;
                previousMovementState = movementState;

                that.setDirection(movementState, direction);
            }
        };
        this.triggerHit = function (NewHp) {
            if(characterAnimations.isAlive()){
                HP = NewHp;
                characterAnimations.hit()
            }
            if(HP <= 0 ){
                HP = 0;
                characterAnimations.died();
            }
            that.updateAnimation();
        };

        this.triggerAttack = function () {
            characterAnimations.attacked();
            that.updateAnimation();
        };

        this.updateAnimation = function () {
            var dir, movementState;

            resetVelocityOnCollision();

            if(characterAnimations.isAlive()){
               characterAnimations.update(p, vx, vy);
            }
            else{
                return;
            }

            if (isPlayable) {
                if (characterAnimations.isCharacterAttacking()) {
                    that.performAttack({dateTime:Date.now()});
                } else if(characterAnimations.isAlive()) {
                    that.onPositionChanged({x:that.posx, y:that.posy, direction:characterAnimations.getDir(), movementState:characterAnimations.getState(), dateTime:Date.now()})
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
                c.fillRect (that.getRelativePosX()  - 25  , that.getRelativePosY() - 128, 50, 3);
                c.fillStyle = "rgb(255,0,0)";
                c.fillRect (that.getRelativePosX() - 25 , that.getRelativePosY() - 128, (50 / 100) * HP, 3);
            }
            else{
                c.font = "20pt Calibri";
                c.fillText("HP : " + HP, 25,25)
            }
            if(isPlayable){
                p.draw(c, [512, 393]);
            }
            else{
                p.draw(c, [that.getRelativePosX(), that.getRelativePosY()]);
            }
        };


        if (isPlayable) {
            /*** input events stuff ***/
            this.keyUp_37 = this.keyUp_39 = function () {

                vx = 0;
                that.updateAnimation();
            };

            this.keyDown_37 = function () {

                vx -= WALK_VX;
                that.updateAnimation();
            };

            this.keyDown_39 = function () {

                vx += WALK_VX;
                that.updateAnimation();
            };

            this.keyUp_38 = this.keyUp_40 = function () {

                vy = 0;
                that.updateAnimation();
            };

            this.keyDown_38 = function () {

                vy -= WALK_VY;
                that.updateAnimation();
            };

            this.keyDown_40 = function () {

                vy += WALK_VY;
                that.updateAnimation();
            };

            this.keyDown_32 = function () {
                characterAnimations.attacked();
                that.updateAnimation();
            };

            this.keyDown_72 = function(){
                var x = 512 - 15;
                var y = 393 - 50;
                var effect = new particleEffect(x ,y , that.getZIndex());
                gs.addEntity(effect);
                effect.start();
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

                var angle = pointAngleCompareToP1({x:that.getRelativePosX(), y:that.getRelativePosY() - halfSpriteSize }, mousePos);
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
});

