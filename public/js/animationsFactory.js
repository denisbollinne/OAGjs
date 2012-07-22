/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 13/03/12
 * Time: 19:19
 */
define("animationsFactory", function () {
    return function () {
        this.createAnimations = function (name, frames, framsToShowEachImageFor) {
            var arr = [];
            for (var i = 0; i < frames; i++) {
                var pad = "";
                if (i < 10) {
                    pad = "0";
                }
                arr.push(["/img/" + name + "00" + pad + i + ".png", framsToShowEachImageFor])
            }
            return arr;
        };
        this.appendImages = function (arr, name, frames) {
            for (var i = 0; i < frames; i++) {
                var pad = "";
                if (i < 10) {
                    pad = "0";
                }
                arr.push("/img/" + name + "00" + pad + i + ".png");
            }
        };
    };
});
