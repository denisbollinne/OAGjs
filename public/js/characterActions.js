/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 26/04/12
 * Time: 20:41
 */
GAME.CharacterActions = function( WALK_VX, WALK_VY){
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
        isHit = true;
        this.update = hitAnimation;
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
            var standAction = lastAction.toString().replace("run", "stand");
            if (!isAttacking && !isHit && !isDead && !isDowned) {
                p.action(standAction);
            }
            movementState = 'stand'
        }
    };

    var attackAnimation = function(p){
        var lastAction = p.get_action();

        var attackAction = lastAction.toString().replace("stand", "attack");
        if (attackAction === lastAction) {
            isAttacking = false;
        } else {
            p.action(attackAction, true, function () {
                var endAttack = p.get_action().toString().replace("attack", "stand");
                p.action(endAttack);
                isAttacking = false;
                that.update = defaultAnimation;
            });
        }
    };

    var hitAnimation = function(p){
        var lastAction = p.get_action();

        var hitAction = lastAction.toString().replace("stand", "hit").replace("run","hit");
        if (hitAction === lastAction) {
            isHit = false;
        } else {
            p.action(hitAction, true, function () {
                var endHit = p.get_action().toString().replace("hit", "stand");
                p.action(endHit);
                isHit = false;
                that.update = defaultAnimation;
            });
        }
    };

    var dyingAnimation = function(p){
        var lastAction = p.get_action();

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
                that.update = function(){};
            });
        }
    };
    that.update = defaultAnimation;
};