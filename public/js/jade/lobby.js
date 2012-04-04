$(document).ready(function(){
    var currentGame = "";
    var getGames = function(){
        jQuery.get('/games',function(games){
            if(games){
                $("#list").empty();
                if(games.length > 0)
                {

                    for(var game in games){
                        var label = "Join";
                        if(games[game] === currentGame){
                            label = "Leave";
                        }
                        $("#list").append("<li>" + games[game] + " <a href='#' game=" +  games[game] +  " >"+ label +"</a></li>");
                    }

                    $('#list li a').click(function(){
                        var clickedGame = $(this).attr('game');
                        if(clickedGame == currentGame){
                            jQuery.post('/games/leave', function(){
                                getGames();
                            });
                        }
                        else{
                            jQuery.post('/games/join',{id: clickedGame}, function(){
                                currentGame = clickedGame;
                                getGames();
                            });
                        }});
                }
            }
            else{
                $("#list").append("<li>No games found</li>");
            }
        });
    };

    $("#createGame").click(function(){
        jQuery.post('/games/join',{id:"Game"}, function(){
            getGames();
            currentGame = "Game";
        });
    });
    $("#startGame").click(function(){
        if(currentGame){
            window.location.href ="game.html";
        }
    });
    getGames();
});
