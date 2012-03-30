var sioModule = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie
    ;

module.exports = function(sio){
    var positionsController = require('./../resources/positions');

    sio.sockets.on('connection', function (socket) {
        var sess = socket.handshake.session;
        socket.log.info(
            'a socket with sessionID'
            , socket.handshake.sessionID
            , 'connected'
        );
        socket.on('error',function(data){
            console.log('ERROR CAUGHT : '+data);
        });
        socket.on('updatePosition', function (data) {
            sess.reload(function () {
                positionsController.updateSio(sess, data,function(succeeded,updatedPosition){
                    if(succeeded){
                        socket.broadcast.emit('updatedPosition',updatedPosition)
                    }
                });
            });

        });

//        console.log('A socket with Char ' + sess.selectedChar._id
//            + ' connected!');
//        console.log('A socket with Session ' + sess.auth.userId
//            + ' connected!');
    });
}