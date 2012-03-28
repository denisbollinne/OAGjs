var sioModule = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie,
    redisIoStore = require('socket.io').RedisStore,
    express = require('express'),
    redisClient = require('redis').RedisClient;
    redisFactory = require('./redisFactory.js')(express) ;

module.exports = function(app){
   var sio =  sioModule.listen(app);
    var sessionStore = new redisFactory.CreateSessionStore();

    sio.configure('production', function(){

        sio.enable('browser client minification');  // send minified client
        sio.enable('browser client etag');          // apply etag caching logic based on version number
        sio.enable('browser client gzip');          // gzip the file
        sio.set('log level', 1);                    // reduce logging

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
    var redisStore = new redisIoStore({
        redisPub: redisFactory.CreateClient(),
        redisSub: redisFactory.CreateClient(),
        redisClient: redisFactory.CreateClient()
    });

    if (redisStore.redisPub instanceof redisClient){
        console.log('O----------K')
    }
    else{
        console.log('-------NOK-------------');
    }

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

    return sio;
}