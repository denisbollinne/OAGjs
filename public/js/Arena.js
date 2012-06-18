/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 8/05/12
 * Time: 19:47
 * To change this template use File | Settings | File Templates.
 */
GAME.Arena = function(imagePath, cicles, rectangles){
    var img = new Image();
    img.src = imagePath;

    var centerPos = {x : 512,y : 393};
    var player = {posx : 0, posy: 0};


    var that = this;

    this.setCurrentPlayer = function(p){
        player  = p;
    };

    this.getZIndex = function () {
        return -1;
    };

    this.getXOffset = function(){
        return player.posx - centerPos.x;
    };

    this.getYOffset = function(){
        return player.posy - centerPos.y;
    };

    this.draw = function (c) {

        var imageX = that.getXOffset();
        var imageY = that.getYOffset();
        var offsetX = 0;
        var offsetY = 0;

        if(imageX < 0){
            offsetX = Math.abs(imageX);
            imageX = 0;
        }
        if(imageY<0){
            offsetY = Math.abs(imageY);
            imageY = 0;
        }

        c.fillStyle = "black";
        c.rect(0, 0, 1024, 768);
        c.fill();

        c.drawImage(img,
            imageX,
            imageY,
            1024,
            768,
            //On Screen
            offsetX,
            offsetY,
            1024,
            768);
    }

};