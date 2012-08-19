define(['resources/positions','resources/games'],function(positionController2, gameController2){
    return function(sio){

        var gameController = new gameController2();
        var positionsController = new positionController2();

        sio.sockets.on('connection', function (socket) {
            var sess = socket.handshake.session;
            if(sess){
                gameController.getCurrentGame(sess.selectedChar,function(game,code){
                if(code){
                    socket.join(game.gameId);
                    socket.log.info('client joined game' +game.gameId);

                    socket.on('updatePosition', function (data) {
                        sess.reload(function () {
                            positionsController.updateSio(sess, data,function(succeeded,updatedPosition,game){
                                if(succeeded){
                                    socket.in(game).broadcast.emit('updatedPosition',updatedPosition)
                                }
                            });
                        });

                    });
                    socket.on('performAttack', function (data) {
                        sess.reload(function () {
                            positionsController.performAttack(sess, data,function(succeeded,performedAttack,game){
                                if(succeeded){
                                    socket.in(game).broadcast.emit('attackPerformed',performedAttack)
                                    socket.emit('attackPerformed',performedAttack)
                                }
                            });
                        });

                    });

                    socket.on('disconnect', function () {
                        socket.log.info('client disconnected from game' +game.gameId);
                        socket.leave(game.gameId);

                    });

                }else{
                    socket.log.error('ERROR IN SOCKET.CONNECTON' );
                }

            })
            }
        });
    };

});