define(function(){
    this.charStatus = function(charId){
        return "CharStatus_"+charId;
    };

    this.charGameId = function(charId){
        return  "Char_"+charId;
    };

    this.games = function(){
        return "Games";
    };

    this.playersInGame = function(gameId){
        return  "Game_"+gameId;
    };

    this.arenaForGame = function(gameId){
        return  "Arena_"+gameId;
    };
});

