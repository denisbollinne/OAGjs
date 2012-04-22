/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 19/04/12
 * Time: 20:20
 * To change this template use File | Settings | File Templates.
 */
GAME.CollisionDetector = function(){
    var characters = [];
    var that = this;

    var preCalculateBoundingBox = function(boundingBox, vx, vy){
        return new GAME.BoundingBox(boundingBox.x + vx, boundingBox.y + vy, boundingBox.w, boundingBox.h);
    };

    this.addCharacter = function(character){
        characters.push(character);
        character.triggersCollision = that.triggersCollision;
    };

    this.triggersCollision = function(character, vx, vy){
        var hasCollision = false;
        for(var c = 0; c< characters.length; c++){
            if(characters[c] !== character){
                if(preCalculateBoundingBox(character.getBoundingBox(), vx, vy).collidesWith(characters[c].getBoundingBox())){
                    hasCollision = true;
                }
            }
        }
        return hasCollision;
    };
};

GAME.BoundingBox = function(x, y, w, h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.right = x + w;
    this.bottom = y + h;
    var that = this;



    this.collidesWith = function(boundingBox){
        var isHorizontalCollision = false;
        if(that.x < boundingBox.x && boundingBox.x < that.right){
            isHorizontalCollision = true;
        }
        if(that.x < (boundingBox.right) && (boundingBox.right) <  that.right){
            isHorizontalCollision = true;
        }

        var isVerticalCollision = false;
        if(that.y < boundingBox.y && boundingBox.y < that.bottom){
            isVerticalCollision = true;
        }
        if(that.y < boundingBox.bottom && boundingBox.bottom < that.bottom){
            isVerticalCollision = true;
        }

        var isContainsCollision = false;
        if(!isHorizontalCollision && !isVerticalCollision){
            if(boundingBox.x < that.x && that.x < boundingBox.right){
                if(boundingBox.y < that.y && that.y < boundingBox.bottom ){
                    isContainsCollision = true;
                }
            }
        }

        return (isHorizontalCollision && isVerticalCollision) || isContainsCollision;
    }
};