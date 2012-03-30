/**
 * connect-heroku-redis
 * Copyright(c) 2010 Michael Hemesath <mike.hemesath@gmail.com>
 * MIT Licensed
 */

var parse = require('url').parse,
    redis = require('redis');

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

        RedisStore.call(this, options2);
    }

    // Inherit from Connect Redis
    ConnectHerokuRedis.prototype = new RedisStore;


    function CreateClient(options) {
        options2 = GetOptions(options);

        var rc =  new redis.createClient(options2.port || options2.socket, options2.host, options2)

        rc.on('error', function(err){
            console.log('RC ERROR : '+err);
        });

        return rc;
    }



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