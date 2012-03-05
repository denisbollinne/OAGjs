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
    res.send('show character ' + req.params.character);
};

exports.edit = function(req, res){
    res.send('edit character ' + req.params.character);
};

exports.update = function(req, res){
    res.send('update character ' + req.params.character);
};

exports.destroy = function(req, res){
    res.send('destroy character ' + req.params.character);
};