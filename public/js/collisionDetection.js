/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 19/04/12
 * Time: 20:20
 * To change this template use File | Settings | File Templates.
 */
define("collisionDetection",["boundingSphere","boundingBox"],function(boundingSphereClass,boundingBoxClass){
    return  function(){
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
                    if(hasBoxCollision(item, trackedItems[c], vx, vy)){
                        hasCollision = true;
                    }
                }
            }
            return hasCollision;
        };

        this.addCircles = function(circles){
            for(var i = 0; i < circles.length; i++){
                var circle = circles[i];
                var box = new boundingSphereClass(circle.x, circle.y, circle.r);
                that.addCollisionItem(box);
            }
        };

        this.addRectangles = function(rectangles){
            for(var i = 0; i < rectangles.length; i++){
                var rect = rectangles[i];
                var box = new boundingBoxClass(rect.x1, rect.y1, Math.abs(rect.x2 - rect.x1), Math.abs(rect.y2 - rect.y1));
                that.addCollisionItem(box);
            }

        };

        var hasBoxCollision = function(item1, item2, vx, vy){
            if(item2.getBoundingBox){
                return preCalculateBoundingBox(item1.getBoundingBox(), vx, vy).collidesWith(item2.getBoundingBox());
            }
            else if(item2.collidesWith){
                return preCalculateBoundingBox(item1.getBoundingBox(), vx, vy).collidesWith(item2);
            }
            return false;
        };

        var hasSphereCollision = function(item1, item2, vx, vy){
            if(item2.getBoundingBox){
                return preCalculateBoundingSphere(item1.getBoundingSphere(), vx, vy).collidesWith(item2.getBoundingSphere())
            }
            else if(item2.collidesWith){
                return preCalculateBoundingSphere(item1.getBoundingSphere(), vx, vy).collidesWith(item2)
            }
            return false;
        };

        var preCalculateBoundingBox = function(boundingBox, vx, vy){
            return new boundingBoxClass(boundingBox.x + vx, boundingBox.y + vy, boundingBox.w, boundingBox.h);
        };

        var preCalculateBoundingSphere = function(boundingSphere, vx, vy){
            return new boundingSphereClass(boundingSphere.x + vx, boundingSphere.y + vy, boundingSphere.r);
        };
    };
});