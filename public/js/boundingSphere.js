/**
 * Created with JetBrains WebStorm.
 * User: Denis
 * Date: 22/07/12
 * Time: 8:43
 * To change this template use File | Settings | File Templates.
 */
define("boundingSphere",function(){
    return function(x, y, r){
        this.x = x;
        this.y = y;
        this.r = r;
        var that = this;

        this.collidesWith = function(boundingBox){
            var distance = Math.sqrt(Math.pow(boundingBox.x - that.x,2) + Math.pow(boundingBox.y - that.y, 2));
            return distance < (that.r + boundingBox.r);
        }
    };
});
