define(['express','init/bootstrap','mongoose'],function(express,bootstrapper,mongoose){
    var app =express();
    bootstrapper(app);
    User = mongoose.model('User');
    return app;
});

