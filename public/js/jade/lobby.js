$(document).ready(function(){
    var currentGame = "";
    var getGamesWithCurrentGame = function(){
      jQuery.get('/games/current', function(current){
          currentGame = current;
          getGames();
      });
    };

    var getGames = function(){
        jQuery.get('/games',function(games){
            if(games){
                $("#list").empty();
                $("#list").append(games);

                $('#list li a').click(function(){
                    var clickedGame = $(this).attr('game');
                    if(clickedGame == currentGame){
                        jQuery.post('/games/leave', function(){
                            currentGame = ''
                            getGames();
                        });
                    }
                    else{
                        jQuery.post('/games/join',{id: clickedGame}, function(){
                            currentGame = clickedGame;
                            getGames();
                        });
                    }
                });
            }
        });
    };

    $("#createGame").click(function(){
        var gameName = $("#gameName").val();
        if(gameName){
            jQuery.post('/games/join',{id:gameName}, function(){
                getGames();
                currentGame = gameName;
                $("#gameName").val('');
            });
        }
        else{
            alert("Please enter game name");
        }

    });
    $("#startGame").click(function(){
        if(currentGame){
            window.location.href ="game.html";
        }
    });
    getGamesWithCurrentGame();
});
