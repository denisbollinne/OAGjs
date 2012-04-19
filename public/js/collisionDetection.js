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

    this.addCharacter = function(character){
        characters.push(character);
        character.triggersCollision = that.triggersCollision;
    };

    this.triggersCollision = function(character, coordinates){
        var hasCollision = false;
        for(var c in characters){
            if(c !== character){
                if(character.getBoundingBox().collidesWith(characters[c].getBoundingBox())){
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
        if(that.x < (boundingBox.right) && (boundingBox.right) <  this.right){
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