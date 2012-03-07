/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 7/03/12
 * Time: 21:51
 */
GAME = {};

GAME.startGame = function(){
    Sprite.preload([
        "img/orbs/orb1.jpg",
        "img/orbs/orb2.jpg",
        "img/orbs/orb3.jpg",
        "img/orbs/orb4.jpg",

    ],
        // when the sprites are loaded, create the world
        function() {
            gs.addEntity(new GAME.Orb(gs));
        }
    );
    var gs = new JSGameSoup("surface", 30);
    gs.launch();
};

