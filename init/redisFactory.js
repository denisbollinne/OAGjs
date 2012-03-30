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

        return new RedisStore({client:CreateClient(options)});
    }


    function CreateClient(options) {
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
       // options.no_ready_check = true;
        options.debug_mode = true;
        var rc =  new redis.createClient(options.port || options.socket, options.host, options)
        rc.auth(options.pass);

        rc.on('error', function(err){
            console.log('RC ERROR : '+err);
        });
        rc.on('ready', function(){
            console.log('RC READY');
        });
        return rc;
    }

    return {CreateClient : CreateClient, CreateSessionStore: ConnectHerokuRedis};


}