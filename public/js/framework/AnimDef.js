define("framework\animDef",function(){
    return function AnimDef( image, duration, tiles, offset){
        this.image = image;
        if(duration){
            this.duration = duration;
        }
        else{
            this.duration = 1;
        }

        if(tiles){
            this.tiles = tiles;
        }
        else{
            this.tiles = 1;
        }


        this.offset = offset;

    };
});