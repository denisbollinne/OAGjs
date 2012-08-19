define(function(){
    return function(app){

        process.on('exit', function () {
            console.log("Closing");
            app.close();
        });

        app.on('close', function () {
            console.log("Closed");
            //close custom DB connections
        });

    };
});