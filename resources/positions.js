var mongoose = require('mongoose');

var position = mongoose.model('Position');

exports.index = function(req, res){
    position.find({},function(err,docs){
       res.send(docs);
   })
};

exports.update = function(req, res){
    if(req.session.selectedChar){
        position.findOne({character:req.session.selectedChar._id},function(err,existingPos){
            if(existingPos != null){
                var newPos = req.body;

                existingPos.x = newPos.x;
                existingPos.y = newPos.y;
                existingPos.direction = newPos.direction;
                existingPos.dateTime = newPos.dateTime;

                existingPos.save();
                res.send(200)
            }
            else{
                res.send(404)
            }
        });
    }
    else{
        res.send(404)
    }
};
