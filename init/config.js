define(['express','stylus','connect-timeout','./redisFactory.js','module','path','everyauth'],
       function(express,stylus,connectTimeout,redisProvider,module,path,everyauth){

    return function(app){
        var __filename = module.uri;
        var __dirname = path.dirname(__filename);

        var  redisFactory = redisProvider(),
            sessionStore = redisFactory.CreateSessionStore();

        var debug = function(app){
            app.use(express.errorHandler({ dump: true, stack: true }));
            app.set('debug',true);
        };

        app.configure('development', function() {
            app.set('db-uri', 'mongodb://localhost:27017/oagjs');
            app.set('port',3000);
            app.set('view options', {
                pretty: true
            });
            app.set('host','http://localhost:3000');

            debug(app);
        });

        app.configure('test', function() {
            app.set('db-uri', 'localhost:27017/oagjs-Test');
            app.set('port',3000);
            app.set('view options', {
                pretty: true
            });
            app.set('host','http://localhost:3000');

            debug(app);
      });

        app.configure('production', function() {
            app.set('db-uri', process.env.MONGOHQ_URL);
            app.set('port',process.env.PORT);
            app.set('debug',true);
            app.set('host','http://ourawesomegamejs.herokuapp.com')
       });


        app.configure('joyent', function() {
            app.set('db-uri', 'mongodb://127.0.0.1:27017/oagjs');
            app.set('port',80);
            app.set('debug',true);
            app.set('host','http://dev.itense.be');

            debug(app);

        });

        app.configure(function() {
            app.set('cookieName','M&DSessionKey');
            app.set('views', __dirname + '/../views');
            app.set('view engine', 'jade');
            app.use(express.favicon());
            app.use(everyauth.middleware());
            app.use(express.bodyParser({uploadDir:'./tmpUploads'}));
            app.use(express.cookieParser());
            app.use(connectTimeout({ time: 10000 }));
            app.use(express.session({ store: sessionStore, secret:'M&DSessionSecret'}));
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
  });
