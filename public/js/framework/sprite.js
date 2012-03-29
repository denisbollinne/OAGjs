/**
 @class A sprite class with different image/animation sequences based upon defined 'actions'.
 @description Allows you to associate a set of animations with a particular entity. To do vector graphics, use the canvas tag methods instead.
 @param anchor selects which side of the sprite's rectangle to 'anchor' the animation to. e.g. ["center", "bottom"] will anchor the sprite to the ground (side view) whilst ["right", "center"] would anchor it to the right hand side.
 @param animations is a dictionary containing all actions and their associated set of images and the number of frames to show each image for. For instance: {"stand": [["img/stand.png", 0],], "walk": [["img/walk1.png", 3], ["img/walk2.png", 3],]} where each walk frame is shown for three frames.
 @param loadedcallback is a function that is called once all of the frames in all action animations are successfully loaded.
 */

GAMEFW = {};

GAMEFW.AnimDef = function AnimDef( image, duration, tiles, offset){
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

GAMEFW.Sprite = function Sprite(anchor, animations, size, loadedcallback) {
    var loadcount = 0;
    var action = "";
    var framecount = -1;
    var frame = 0;
    var that = this;
    var numframes = 0;
    var loopcallback = null;
    this.loaded = false;
    this.width = 0;
    this.height = 0;

    // load up all of the images
    for (var animation in animations) {
        // replace string entries with Images, unless they already are
            if (typeof(animations[animation].image) == "string") {
                loadcount += 1;
                var imageBeingLoaded = new Image();
                imageBeingLoaded.src = animations[animation].image;
                animations[animation].image = imageBeingLoaded;
                imageBeingLoaded.onload = function () {
                    loadcount -= 1;
                    if (loadcount == 0) {
                        that.width = size;
                        that.height = size;
                        if (loadedcallback) {
                            that.loaded = true;
                            loadedcallback();
                        }
                    }
                }
        }
        if (loadcount == 0) {
            that.width = size;
            that.height = size;
            if (loadedcallback) {
                that.loaded = true;
                loadedcallback();
            }
        }
    }

    // calculate offsets (center, right, left, top, bottom)
    var calc_x = {
        "left": function() {
            return 0;
        },
        "right": function() {
            return that.width;
        },
        "center": function() {
            return that.width / 2;
        }
    };

    var calc_y = {
        "top": function() {
            return 0;
        },
        "bottom": function() {
            return that.height;
        },
        "center": function() {
            return that.height / 2;
        }
    };

    /**
     Sets which named animation/action to play.
     @param newActionValue is the name of the animation/action you defined on initialisation.
     @param reset indicates whether the frame number should be reset to the start of the animation.
     @param callback is called when the animation has completed one loop - receives parameter "action".
     **/
    this.action = function(newActionValue, reset, callback) {
        if (typeof(callback) == "undefined") {
            loopcallback = null;
        } else {
            loopcallback = callback;
        }
        action = newActionValue;
        numframes = animations[newActionValue].tiles;
        if (reset) {
            framecount = animations[newActionValue].duration;
            frame = animations[newActionValue].offset;
        } else {
            frame = (frame % animations[newActionValue].tiles) + animations[newActionValue].offset;
        }
        that.update = that._update;
        that.draw = that._draw;
        that.aabb = that._aabb;
        return this;
    };

    /** Returns the current action being played. **/
    this.get_action = function() {
        return action;
    };

    // increment frame counter etc.
    this._update = function() {
        framecount -= 1;
        if (framecount <= 0) {
            if (loopcallback && (frame + 1 >= (animations[action].tiles + animations[action].offset ))) {
                loopcallback(action);
            }
            frame = ((frame + 1) % animations[action].tiles) + animations[action].offset;
            framecount = animations[action].duration;
        }
    };

    // draw this sprite on canvas c at position with respect to the anchor specified
    this._draw = function(c, pos) {
        var imageStoredInFramesCollection = animations[action].image;

        var columns =  imageStoredInFramesCollection.width / that.width;

        var rowOfFrame = Math.floor(frame / columns);
        var columnOfFrame = frame - (columns * rowOfFrame);

        var verticalOffSetInSpriteSheet = rowOfFrame * that.height;
        var horizontalOffSetInSpriteSheet = columnOfFrame * that.width;

        //context.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);

        var xPosOnScreen = pos[0] - calc_x[anchor[0]]();
        var yPosOnScreen = pos[1] - calc_y[anchor[1]]();

        c.drawImage(imageStoredInFramesCollection,
            horizontalOffSetInSpriteSheet,
            verticalOffSetInSpriteSheet,
            that.width,
            that.height,
            xPosOnScreen,
            yPosOnScreen,
            that.width,
            that.height);
    };

    /** Call this method from inside the owner entity's update() method. */
    this.update = function() {};

    /**
     Draw the sprite. Call this method from inside the owner entity's draw() method.
     @param c is the canvas to draw on (passed to the entity's draw(c) method)
     @param pos is the position to draw at relative to the anchor point.
     **/
    this.draw = function() {};
};

/**
 @method preload
 @description Pre-loads a whole array of images. Provides feedback on which images are loaded via the progresscallback, which returns the number of images left to load each time one is loaded, and 0 when the final image is loaded.
 @param images is an array of strings containing the URLs of images to load.
 @param completedcallback is a function which is called when all images are loaded
 @param progresscallback is a function accepting an integer, which is the count of images left to load
 */
GAMEFW.Sprite.preload = function(images, completedcallback, progresscallback) {
    var loadcount = images.length;
    var img = [];
    for (var i=0; i<images.length; i++) {
        img[i] = new Image();
        img[i].onload = function () {
            loadcount -= 1;
            if (progresscallback)
                progresscallback(loadcount);
            if (loadcount == 0 && completedcallback) {
                completedcallback();
            }
        };
        img[i].src = images[i];
    }
};
