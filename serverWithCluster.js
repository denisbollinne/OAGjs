/**
 * Created by JetBrains WebStorm.
 * User: Denis
 * Date: 1/04/12
 * Time: 11:33
 * To change this template use File | Settings | File Templates.
 */
var cluster = require('cluster');

var numCPUs = require('os').cpus().length;

if(cluster.isMaster){
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
}
else{
    var app = require('./app.js')
    console.log('Server running at http://127.0.0.1:'+app.set('port')+'/');

    app.listen(app.set('port'));
}
