/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 7/03/12
 * Time: 21:51
 */
GAME = {};

GAME.startGame = function () {
    var animations = new GAME.AnimationFactory();

    var imagesToPreload = [];
    imagesToPreload.push("/img/knight/tileSet.png");
    var currentCharId;
    var allOtherChars = {};
    var player;
    var updateCharacters = function (newPos) {
        if (newPos.charId !== currentCharId) {
            var foundChar = allOtherChars[newPos.charId];
            if (foundChar) {
                foundChar.setDirectionForNPC(newPos.x, newPos.y, newPos.direction, newPos.movementState, newPos.dateTime)
            } else {
                var newPlayer = new GAME.Player(gs, false, newPos).character;
                allOtherChars[newPos.charId] = newPlayer;
                gs.addEntity(newPlayer);
            }
        }
    };

    var triggerAttach = function (attackingCharId, hurtedCharsStatus) {
        var foundChar = allOtherChars[attackingCharId];
        if (foundChar) {
            foundChar.triggerAttack();
        }
        if (hurtedCharsStatus.length > 0) {
            for (var huntedChar in hurtedCharsStatus) {
                var hurtedCharStatus = hurtedCharsStatus[huntedChar];

                var foundHurtedChar = allOtherChars[hurtedCharStatus.charId];
                if (foundHurtedChar) {
                    foundHurtedChar.setHurted(hurtedCharStatus.HP)
                } else {
                    if (hurtedCharStatus.charId === currentCharId) {
                        player.setHurted(hurtedCharStatus.HP)
                    }
                }
            }
        }
    };

    var onPositionChanged = function (data) {
        socket.emit('updatePosition', data);
    };

    var performAttack = function (data) {
        socket.emit('performAttack', data);
    };

    var gameIsLoaded = false;
    var OnSocketIoConnect = function () {
        if (!gameIsLoaded) {
            GAMEFW.Sprite.preload(imagesToPreload, // when the sprites are loaded, create the world
                                  function () {
                                      gameIsLoaded = true;
                                      jQuery.get('/characters/current', function (currentPlayerInfo) {
                                          var gameId = currentPlayerInfo.game;
                                          currentCharId = currentPlayerInfo.character._id;
                                          player = new GAME.Player(gs, true,
                                                                   currentPlayerInfo.character.position).character;
                                          player.onPositionChanged = onPositionChanged;
                                          player.performAttack = performAttack;

                                          // var enemy = new GAME.skeleton(gs).character;

                                          //gs.addEntity(enemy);
                                          gs.addEntity(player);

                                          socket.on('updatedPosition', function (data) {
                                              updateCharacters(data);
                                          });
                                          socket.on('attackPerformed', function (data) {
                                              triggerAttach(data.attackingChar, data.hurtedChars);
                                          });
                                      });
                                  });
        } else {
            console.debug('socket.io is somehow reconnecting');
        }
    };
    var socket = io.connect();
    socket.on('connect', OnSocketIoConnect);

    var gs = new JSGameSoup("surface", 50);
    gs.launch();
};

