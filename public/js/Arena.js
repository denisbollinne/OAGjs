/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 8/05/12
 * Time: 19:47
 */
define(function(){
    return function(imagePath, cicles, rectangles){
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

        this.areCoordinatesInArena = function(coordinates){
            var fullImageHeight = img.height;
            var fullImageWidth = img.width;
            if(coordinates.x > 0 && coordinates.y > 64){
                if(coordinates.x < fullImageWidth && coordinates.y < fullImageHeight){
                    return true;
                }
            }
            return false;
        };

        this.draw = function (c) {

            var imagePositionX = that.getXOffset();
            var imagePositionY = that.getYOffset();
            var offsetX = 0;
            var offsetY = 0;
            var heightOnScreen = 768;
            var widthOnScreen = 1024;

            var fullImageHeight = img.height;
            var fullImageWidth = img.width;

            if(imagePositionX < 0){
                offsetX = Math.abs(imagePositionX);
                imagePositionX = 0;
            }
            if(imagePositionY<0){
                offsetY = Math.abs(imagePositionY);

                imagePositionY = 0;
            }

            var remainingBottomMargin = fullImageHeight - 768 - imagePositionY;
            var remainingRightMargin = fullImageWidth - 1024 - imagePositionX;

            if(remainingBottomMargin < 0){
                heightOnScreen = heightOnScreen + remainingBottomMargin;
                offsetY = 0;
            }

            if(remainingRightMargin < 0){
                widthOnScreen = widthOnScreen + remainingRightMargin;
                offsetX = 0;
            }

            c.drawImage(img,
                        imagePositionX,
                        imagePositionY,
                        widthOnScreen,
                        heightOnScreen,
                //On Screen
                        offsetX,
                        offsetY,
                        widthOnScreen,
                        heightOnScreen);
        }
    };
});