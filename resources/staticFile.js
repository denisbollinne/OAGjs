/**
 * Created with JetBrains WebStorm.
 * User: Denis
 * Date: 19/07/12
 * Time: 18:35
 * To change this template use File | Settings | File Templates.
 */
define(['fs'],function(fs){
    function fsController(){

        fsController.prototype.getRequireJsFile = function(req,res){
            res.sendfile('node_modules/requirejs/require.js');
        };
    };

    return fsController;
})
