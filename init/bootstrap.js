var express = require('express')
    , url = require('url')
    , stylus = require('stylus')
    , routes = require('./routes.js')
    , configure = require('./config.js')
    , everyauth = require('./everyauth.js')
    , mongoose = require('./mongoose.js')
    ,mongooseAuth = require('../lib/mongoose-auth/index.js')
    , socketIoConfig = require('./socketIoConfig.js')
    , socketIoRoutes = require('./socketIoRoutes.js')
    , onShutDown = require('./shutdown.js');

module.exports = function(app){
    configure(app,everyauth.validateAuthenticated);
    everyauth(app);
    mongoose(app,mongooseAuth);

    console.log(mongooseAuth);
    app.use(mongooseAuth.middleware());

    mongooseAuth.helpExpress(app);

    routes(app,everyauth.validateAuthenticated);

    socketIoConfig(app,function(socketIo){
        socketIoRoutes(socketIo);
    });

    onShutDown(app);

    console.log('FORK INITIALIZED')
}