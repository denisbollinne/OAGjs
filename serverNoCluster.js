/**
 * Created by JetBrains WebStorm.
 * User: Denis
 * Date: 1/04/12
 * Time: 11:33
 * To change this template use File | Settings | File Templates.
 */

var requirejs = require('requirejs');

requirejs.config({
     nodeRequire: require
                     //  ,    packages: ["lib"]
});

requirejs(['./app.js','init/bootstartSocketIo'],function(app,sioBootstrap){
    console.log('Server running at http://127.0.0.1:'+app.set('port')+'/');

   var server =  app.listen(app.set('port'));
    sioBootstrap(server);
});
