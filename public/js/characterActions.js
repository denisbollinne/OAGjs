/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 26/04/12
 * Time: 20:41
 */
define('characterAction',function(){
    return function( WALK_VX, WALK_VY){
        var isAttacking = false;
        var isHit = false;
        var isDead = false;
        var isDowned = false;
        var that = this;
        var dir = '';
        var movementState = '';

        this.update = function(p,vx, vy){};

        this.attacked = function(){
            isAttacking = true;
            that.update = attackAnimation;
        };

        this.died = function(){
            isDowned = true;
            isDead = false;
            that.update = dyingAnimation;
        };

        this.hit = function(){
            if(movementState==='stand'){
                isHit = true;
                this.update = hitAnimation;
            }
        };

        this.isAlive = function(){
            return !isDead;
        };

        this.getState = function(){
            return movementState;
        };

        this.getDir = function(){
            return dir;
        };

        this.isCharacterAttacking = function(){
            return isAttacking;
        };

        var defaultAnimation = function(p, vx, vy){
            var lastAction = p.get_action();

            movementState = 'walk';

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
                var standAction = replaceActionWith(lastAction, "stand");
                if (!isAttacking && !isHit && !isDead && !isDowned) {
                    p.action(standAction);
                }
                movementState = 'stand'
            }
        };

        var attackAnimation = function(p){
            var lastAction = p.get_action();

            var attackAction = replaceActionWith(lastAction,"attack");
            if (attackAction === lastAction) {
                isAttacking = false;
            } else {
                p.action(attackAction, true, function () {
                    var endAttack = replaceActionWith(p.get_action(),"stand");
                    p.action(endAttack);
                    isAttacking = false;
                    that.update = defaultAnimation;
                });
            }
        };

        var hitAnimation = function(p){
            var lastAction = p.get_action();

            var hitAction = replaceActionWith(lastAction,"hit");
            if (hitAction === lastAction) {
                isHit = false;
            } else {
                p.action(hitAction, true, function () {
                    var endHit = replaceActionWith(p.get_action(), "stand");
                    p.action(endHit);
                    isHit = false;
                    that.update = defaultAnimation;
                });
            }
        };

        var dyingAnimation = function(p){
            var lastAction = p.get_action();

            var dyingAction = replaceActionWith(lastAction,"dying");
            if (dyingAction === lastAction) {
                isDowned = false;
            }
            else{
                p.action(dyingAction,true, function(){
                    var deathAction = replaceActionWith(lastAction, "death");
                    p.action(deathAction);
                    isDowned = false;
                    isDead = true;
                    that.update = function(){};
                });
            }
        };
        that.update = defaultAnimation;

        var replaceActionWith = function(current, expected){
            var actions = ["stand","run","death","dying","attack","hit"];
            var actionString = current.toString();

            for(var i=0;i<actions.length;i++){
                var action = actions[i];
                actionString = actionString.replace(action,expected);
            }
            return actionString;
        }
    };
})
