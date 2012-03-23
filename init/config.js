var express = require('express'),
    mongoStore = require('connect-mongodb'),
    stylus = require('stylus'),
    connectTimeout = require('connect-timeout')
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
        app.set('debug',false);
        app.set('host','http://ourawesomegamejs.herokuapp.com')
   });

    app.configure(function() {
        app.set('views', __dirname + '/../views/users');
        app.set('view engine', 'jade');
        app.use(express.favicon());
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(connectTimeout({ time: 10000 }));
        app.use(express.session({cookie: {maxAge: 600000}, store: new mongoStore({url:app.set('db-uri'), reapInterval: 30000}), secret:'topsecret'}));
      //  app.use(express.logger({ format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms' }))
        app.use(express.methodOverride());
        app.use(stylus.middleware({ src: __dirname + '/../public' }));
        app.use(express.static(__dirname + '/../public'));
        app.set('mailOptions', {
            host: 'localhost',
            port: '25',
            from: 'nodepad@example.com'
        });
    });

}
