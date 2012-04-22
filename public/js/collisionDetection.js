/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 19/04/12
 * Time: 20:20
 * To change this template use File | Settings | File Templates.
 */
GAME.CollisionDetector = function(){
    var trackedItems = [];
    var that = this;

    this.addCollisionItem = function(collisionItem){
        trackedItems.push(collisionItem);
        collisionItem.triggersCollision = that.triggersCollision;
    };

    this.triggersCollision = function(item, vx, vy){
        var hasCollision = false;
        for(var c = 0; c< trackedItems.length; c++){
            if(trackedItems[c] !== item){
                if(hasSphereCollision(item, trackedItems[c], vx, vy)){
                    hasCollision = true;
                }
            }
        }
        return hasCollision;
    };

    var hasBoxCollision = function(item1, item2, vx, vy){
        return preCalculateBoundingBox(item1.getBoundingBox(), vx, vy).collidesWith(item2.getBoundingBox());
    };

    var hasSphereCollision = function(item1, item2, vx, vy){
        return preCalculateBoundingSphere(item1.getBoundingSphere(), vx, vy).collidesWith(item2.getBoundingSphere())
    };

    var preCalculateBoundingBox = function(boundingBox, vx, vy){
        return new GAME.BoundingBox(boundingBox.x + vx, boundingBox.y + vy, boundingBox.w, boundingBox.h);
    };

    var preCalculateBoundingSphere = function(boundingSphere, vx, vy){
        return new GAME.BoundingSphere(boundingSphere.x + vx, boundingSphere.y + vy, boundingSphere.r);
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

GAME.BoundingSphere = function(x, y, r){
      this.x = x;
      this.y = y;
      this.r = r;
      var that = this;

      this.collidesWith = function(boundingBox){
          var distance = Math.sqrt(Math.pow(boundingBox.x - that.x,2) + Math.pow(boundingBox.y - that.y, 2));
          return distance < (that.r + boundingBox.r);
      }
};