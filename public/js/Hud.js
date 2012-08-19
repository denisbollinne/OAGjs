/**
 * Created with JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 8/08/12
 * Time: 19:28
 * To change this template use File | Settings | File Templates.
 */
define(function(){

    var img = new Image();
    img.src = "img/varia/Menu_tmp.png";

    return function(gs){
        this.draw = function(c){
            c.drawImage(img,
                312,
                680);
        };

        this.update = function(){

        };
    }});