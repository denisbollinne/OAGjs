var everyauth = require('everyauth')
    , Promise = everyauth.Promise;

module.exports =function(app){
    everyauth.debug = app.set('debug');
    everyauth.everymodule.moduleTimeout(100000); // to turn off timeouts
};

module.exports.validateAuthenticated = function(req,res,next){
    if(req.loggedIn){
        next();
    }
    else{
        res.redirect('/login');
    }
};

