define(function(){
    return function(app){

        app.resource = function(path, obj,validateAuthentication) {
            this.get(path, validateAuthentication,obj.index); // Index
            this.get(path + '/new', validateAuthentication,obj.new); // new
            this.post(path , validateAuthentication,obj.create); // create
            this.get(path + '/:id', validateAuthentication, obj.show); //show
            this.get(path + '/:id/edit', validateAuthentication,obj.edit); //edit
            this.put(path + '/:id', validateAuthentication, obj.update); //update
            this.del(path + '/:id', validateAuthentication, obj.destroy); //destroy


            this.get(path + '/:a..:b.:format?', validateAuthentication, function(req, res){
                var a = parseInt(req.params.a, 10)
                    , b = parseInt(req.params.b, 10)
                    , format = req.params.format;
                obj.range(req, res, a, b, format);
            });

        };
    };
});