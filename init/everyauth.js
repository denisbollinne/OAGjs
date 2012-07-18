define(['everyauth'],function(everyauth){
    var Promise = everyauth.Promise;

    return function(app){
        everyauth.debug = app.set('debug');
        everyauth.everymodule.moduleTimeout(100000); // to turn off timeouts

        return  function(req,res,next){
            if(req.loggedIn){
                next();
            }
            else{
                res.redirect('/login');
            }
        };
    };

});

