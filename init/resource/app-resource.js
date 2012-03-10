module.exports = function(app){

    app.resource = function(path, obj) {
        this.get(path, obj.index); // Index
        this.get(path + '/new',obj.new); // new
        this.post(path ,obj.create); // create
        this.get(path + '/:id', obj.show); //show
        this.get(path + '/:id/edit',obj.edit); //edit
        this.put(path + '/:id', obj.update); //update
        this.del(path + '/:id', obj.destroy); //destroy


        this.get(path + '/:a..:b.:format?', function(req, res){
            var a = parseInt(req.params.a, 10)
                , b = parseInt(req.params.b, 10)
                , format = req.params.format;
            obj.range(req, res, a, b, format);
        });

    };
};