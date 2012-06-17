exports.charStatus = function(charId){
    return "CharStatus_"+charId;
};

exports.charGameId = function(charId){
    return  "Char_"+charId;
};

exports.games = function(){
    return "Games";
};

exports.playersInGame = function(gameId){
    return  "Game_"+gameId;
};

exports.arenaForGame = function(gameId){
    return  "Arena_"+gameId;
};