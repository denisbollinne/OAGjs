define(['socket.io','connect','http'],function(sioModule,connect,http){
    var parseCookie = connect.utils.parseCookie,
        redisIoStore =  sioModule.RedisStore;

   return function(app,callback){
       var redisFactory = require('init/redisFactory')() ;
       var server = http.createServer(app);       
       var sio =  sioModule.listen(server);
       var sessionStore = redisFactory.CreateSessionStore();

        sio.configure('production', function(){

            sio.enable('browser client minification');  // send minified client
            sio.enable('browser client etag');          // apply etag caching logic based on version number
            sio.enable('browser client gzip');          // gzip the file
            sio.set('log level', 3);                    // reduce logging

            //HEROKU
            sio.set("transports", ["xhr-polling"]); //HEROKU
            sio.set("polling duration", 10);
        });

        sio.configure('joyent', function(){

            sio.enable('browser client minification');  // send minified client
            sio.enable('browser client etag');          // apply etag caching logic based on version number
            sio.enable('browser client gzip');          // gzip the file
            sio.set('log level', 4);                    // reduce logging


            sio.set('transports', [                     // enable all transports (optional if you want flashsocket)
                'websocket'
                , 'flashsocket'
                , 'htmlfile'
                , 'xhr-polling'
                , 'jsonp-polling'
            ]);
        });

        sio.configure('development', function(){

            //HEROKU trying to use the same settings in dev
            sio.set("transports", ["xhr-polling"]); //HEROKU
            sio.set("polling duration", 10);
            sio.set('log level', 2);
            //        sio.set('transports', [                     // enable all transports (optional if you want flashsocket)
    //            'websocket'
    //            , 'flashsocket'
    //            , 'htmlfile'
    //            , 'xhr-polling'
    //            , 'jsonp-polling'
    //        ]);
        });

       var redisPub= redisFactory.CreateClient();
       var redisSub= redisFactory.CreateClient();
       var redisClient =  redisFactory.CreateClient();
        var options = {
            redisPub : redisPub,
            redisSub : redisSub,
            redisClient : redisClient,
            redis : redisFactory.Redis
        };
        var redisStore = new redisIoStore(options);
        sio.set('store', redisStore);

        sio.set('authorization', function (data, accept) {
            // check if there's a cookie header
            if (!data.headers.cookie)
                return accept('No cookie transmitted.', false);

            data.cookie = parseCookie(data.headers.cookie);
            data.sessionID = data.cookie['connect.sid'];

            sessionStore.load(data.sessionID, function (err, session) {
                if (err || !session || !session.auth.loggedIn)
                    return accept('Error', false);

                data.session = session;
                return accept(null, true);
            });

            // accept the incoming connection
            accept(null, true);
        });

        callback(sio);
    };
});