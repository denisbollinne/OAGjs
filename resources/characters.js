exports.index = function(req, res){
    res.send('characters index');
};

exports.new = function(req, res){
    res.send('new character');
};

exports.create = function(req, res){
    res.send('create character');
};

exports.show = function(req, res){
    res.send('show character ' + req.params.id);
};

exports.edit = function(req, res){
    res.send('edit character ' + req.params.id);
};

exports.update = function(req, res){
    res.send('update character ' + req.params.id);
};

exports.destroy = function(req, res){
    res.send('destroy character ' + req.params.id);
};
