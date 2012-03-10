var express = require('express')
    , url = require('url')
    , stylus = require('stylus')
    , routes = require('./routes.js')
    , configure = require('./config.js')
    , everyauth = require('./everyauth.js')
    , mongoose = require('./mongoose.js')
    , onShutDown = require('./shutdown.js');

module.exports = function(app){
    configure(app);
    routes(app);
    everyauth(app);
    mongoose(app);
    onShutDown(app);
    console.log('Server running at http://127.0.0.1:'+app.set('port')+'/');

    app.listen(app.set('port'));
}