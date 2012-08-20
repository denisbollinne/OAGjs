define(['init/socketIoConfig','init/socketIoRoutes']
    ,function(socketIoConfig  , socketIoRoutes ){

        return function(server){
            socketIoConfig(server,function(socketIo){
                socketIoRoutes(socketIo);
            });
        }
    });
