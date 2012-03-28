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
        var redisToGo = process.env.REDISTOGO_URL ? parse(process.env.REDISTOGO_URL) : false;
        console.log("redisToGoURL", redisToGo);
        options = options || {};

        if (redisToGo) {
            options.host = options.host || redisToGo.host;
            options.port = options.port || redisToGo.port;

            if (!options.pass && redisToGo.auth) {
                options.pass = options.pass || redisToGo.auth.split(":")[1];
            }
        }
        console.log("RedisStore options", options);
        RedisStore.call(this, options);
    }


    function CreateClient(options) {
        var redisToGo = process.env.REDISTOGO_URL ? parse(process.env.REDISTOGO_URL) : false;

        options = options || {};

        if (redisToGo) {
            options.host = redisToGo.host || options.host;
            options.port = redisToGo.port || options.port;

            if (!options.pass && redisToGo.auth) {
                options.pass =  redisToGo.auth.split(":")[1];
            }
        }
        console.log("RedisStore options", options);

       return new redis.createClient(options.port || options.socket, options.host, options)
    }

    // Inherit from Connect Redis
    ConnectHerokuRedis.prototype = new RedisStore;

    return {CreateClient : CreateClient, CreateSessionStore: ConnectHerokuRedis};


}