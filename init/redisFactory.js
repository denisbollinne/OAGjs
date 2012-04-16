var parse = require('url').parse,
    express = require('express'),
    redis = require('redis');

var redisStoreClient;

module.exports = function() {

    var RedisStore = require('connect-redis')(express);

    function ConnectHerokuRedis(options) {
       redisStoreClient = redisStoreClient || CreateClient(options);
       return new RedisStore({client:redisStoreClient});
    }


    function CreateClient(options,callback) {
        var redisToGo = process.env.REDISTOGO_URL ? parse(process.env.REDISTOGO_URL) : false;
        options = options || {};

        var pass;
        if (redisToGo) {
            options.host = options.host || redisToGo.hostname;
            options.port = options.port || redisToGo.port;

            if (!options.pass && redisToGo.auth) {
                options.pass = options.pass || redisToGo.auth.split(":")[1];
            }
        }
       // options.no_ready_check = true;
        options.debug_mode = true;
        var rc =  new redis.createClient(options.port || options.socket, options.host, options)

        rc.auth(options.pass);
        rc.on('error', function(err){
            console.log('RC ERROR : '+err);
        });


        return rc;
    }

    return {CreateClient : CreateClient, CreateSessionStore: ConnectHerokuRedis, Redis:redis};


}