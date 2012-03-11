var everyauth = require('everyauth')
    , Promise = everyauth.Promise;

module.exports =function(app){
    everyauth.debug = app.set('debug');
};

module.exports.validateAuthenticated = function(req,res,next){
    if(req.loggedIn){
        next();
    }
    else{
        res.redirect('/login');
    }
};

