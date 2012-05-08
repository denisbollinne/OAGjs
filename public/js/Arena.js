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

    var player = {posx : 500, posy : 500};

    var that = this;

    this.setPlayer = function(p){
        player  = p;
    };

    this.getZIndex = function () {
        return -1000;
    };

    this.draw = function (c) {

        c.drawImage(img,
            player.posx,
            player.posy ,
            1024,
            768,
            //On Screen
            0,
            0,
            1024,
            768);
    }

};