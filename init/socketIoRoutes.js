var sioModule = require('socket.io'),
    parseCookie = require('connect').utils.parseCookie
    ;

module.exports = function(sio){
    var positionsController = require('./../resources/positions.js');
    var gameController = require('./../resources/games.js');

    sio.sockets.on('connection', function (socket) {
        var sess = socket.handshake.session;
        gameController.getCurrentGame(sess.selectedChar,function(gameId,code){
            if(code){
                socket.join(gameId);
                socket.log.info(
                    'a socket with sessionID'
                    , socket.handshake.sessionID
                    , 'connected'
                );

                socket.on('updatePosition', function (data) {
                    sess.reload(function () {
                        positionsController.updateSio(sess, data,function(succeeded,updatedPosition,game){
                            if(succeeded){
                                socket.in(game).broadcast.emit('updatedPosition',updatedPosition)
                            }
                        });
                    });

                });

                socket.on('disconnect', function () {
                    socket.leave(gameId);
                });

            }else{
                socket.log.error('ERROR IN SOCKET.CONNECTON' );
            }

        })
    });
}