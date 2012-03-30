var sioModule = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie,
    redisIoStore =  sioModule.RedisStore;


module.exports = function(app,sessionStore,express){
   var redisFactory = require('./redisFactory.js')(express) ;
   var sio =  sioModule.listen(app);

    sio.configure('production', function(){

        sio.enable('browser client minification');  // send minified client
        sio.enable('browser client etag');          // apply etag caching logic based on version number
        sio.enable('browser client gzip');          // gzip the file
        sio.set('log level', 3);                    // reduce logging

        //HEROKU
        sio.set("transports", ["xhr-polling"]); //HEROKU
        sio.set("polling duration", 10);
    });

    sio.configure('development', function(){
        sio.set('transports', [                     // enable all transports (optional if you want flashsocket)
            'websocket'
            , 'flashsocket'
            , 'htmlfile'
            , 'xhr-polling'
            , 'jsonp-polling'
        ]);
    });

    redisFactory.CreateClient({},function(redisPub){
        console.log('RC 1 OK');
        redisFactory.CreateClient({},function(redisSub){
            console.log('RC 2 OK');
            redisFactory.CreateClient({},function(redisClient){
                console.log('RC 3 OK');
                var options = {
                    redisPub : redisPub,
                    redisSub : redisPub,
                    redisClient : redisPub,
                    redis : redisFactory.redis
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
            })
        })
    })

    return sio;
}