/**
 * connect-heroku-redis
 * Copyright(c) 2010 Michael Hemesath <mike.hemesath@gmail.com>
 * MIT Licensed
 */

var parse = require('url').parse;

/**
 * Return connect heroku redis store
 * @param {int} version
 * @return RedisStore
 * @api public
 */
module.exports = function(express) {

    var RedisStore = require('connect-redis')(express);

    function ConnectHerokuRedis(options) {
        var options2 = GetOptions(options);

//        console.log("RedisStore options", options);
        RedisStore.call(this, options2);
    }

    // Inherit from Connect Redis
    ConnectHerokuRedis.prototype = new RedisStore;


    function CreateClient(options) {
        options = GetOptions(options);


//        console.log("RedisStore options", options);

        return new redis.createClient(options.port || options.socket, options.host, options)
//        this =
//        RedisClient.call(net_client, options);
    }
    // Inherit from RedisClient
 //   CreateClient.prototype = RedisClient;


    function GetOptions(options) {
        var redisToGo = process.env.REDISTOGO_URL ? parse(process.env.REDISTOGO_URL) : false;
        console.log("redisToGoURL", redisToGo);
        options = options || {};

        if (redisToGo) {
            options.host = options.host || redisToGo.hostname;
            options.port = options.port || redisToGo.port;

            if (!options.pass && redisToGo.auth) {
                options.pass = options.pass || redisToGo.auth.split(":")[1];
            }
        }
        return options;
    }

    return {CreateClient : CreateClient, CreateSessionStore: ConnectHerokuRedis};


}