/**
 * Created with JetBrains WebStorm.
 * User: Denis
 * Date: 19/07/12
 * Time: 19:36
 * To change this template use File | Settings | File Templates.
 */
define('framework/preload',function(){
    /**
     @method preload
     @description Pre-loads a whole array of images. Provides feedback on which images are loaded via the progresscallback, which returns the number of images left to load each time one is loaded, and 0 when the final image is loaded.
     @param images is an array of strings containing the URLs of images to load.
     @param completedcallback is a function which is called when all images are loaded
     @param progresscallback is a function accepting an integer, which is the count of images left to load
     */
    return function(images, completedcallback, progresscallback) {
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
});
