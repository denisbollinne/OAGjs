/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 8/05/12
 * Time: 19:47
 * To change this template use File | Settings | File Templates.
 */
GAME.Arena = function(imagePath){
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

        c.drawImage(img,
            that.getXOffset(),
            that.getYOffset(),
            1024,
            768,
            //On Screen
            0,
            0,
            1024,
            768);
    }

};