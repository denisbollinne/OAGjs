define(['require','url','stylus','init/routes','init/config','init/everyauth',
           'init/mongoose'
           ,'init/socketIoConfig','init/socketIoRoutes','init/shutdown','lib/mongoose-auth-ported/index']
    ,function(require,url,stylus,routes,configure,everyauth
    , mongoose , socketIoConfig  , socketIoRoutes , onShutDown,mongooseAuth){

    return function(app){

        configure(app);
        console.log(mongooseAuth);
       var validateAuthenticated =  everyauth(app);
        mongoose(app,mongooseAuth);

        app.use(mongooseAuth.middleware());

        mongooseAuth.helpExpress(app);

        routes(app,validateAuthenticated);

        socketIoConfig(app,function(socketIo){
            socketIoRoutes(socketIo);
        });

        onShutDown(app);
    }
});
