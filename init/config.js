var express = require('express'),
    stylus = require('stylus'),
    connectTimeout = require('connect-timeout'),
    redisFactory = require('./redisFactory.js')(express),
    sessionStore
    ;

module.exports = function(app, validateAuthenticated){

    app.configure('development', function() {
        app.set('db-uri', 'mongodb://localhost:27017/oagjs');
        app.set('port',3000);
        app.use(express.errorHandler({ dump: true, stack: true }));
        app.set('view options', {
            pretty: true
        });
        app.set('debug',true);
        app.set('host','http://localhost:3000')
    });

    app.configure('test', function() {
        app.set('db-uri', 'localhost:27017/oagjs-Test');
        app.set('port',3000);
        app.set('view options', {
            pretty: true
        });
        app.set('debug',true);
        app.set('host','http://localhost:3000')
  });

    app.configure('production', function() {
        app.set('db-uri', process.env.MONGOHQ_URL);
        app.set('port',process.env.PORT);
        app.set('debug',true);
        app.set('host','http://ourawesomegamejs.herokuapp.com')
   });

    app.configure(function() {
        app.set('cookieName','M&DSessionKey');
        app.set('views', __dirname + '/../views/users');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(connectTimeout({ time: 10000 }));
        app.use(express.session({ store: sessionStore = redisFactory.CreateSessionStore(), secret:'M&DSessionSecret'}));
    //    app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
        app.use(express.methodOverride());
        app.use(stylus.middleware({ src: __dirname + '/../public' }));
        app.use(express.static(__dirname + '/../public'));
        app.set('mailOptions', {
            host: 'localhost',
            port: '25',
            from: 'nodepad@example.com'
        });
    });

    return sessionStore;
}
