$(document).ready(function(){
    jQuery.get('/characters',function(characters){
        $("#list").empty();
        if(characters){
            $("#list").append(characters);

            $("#list li a").click(function(){
                var char = $(this).attr('char');

                jQuery.get("/characters/select/" + char,function(){
                    window.location.href ="/lobby";
                });
                }
            );
        }
    });
    $("#delete").click(function(){
       if(confirm("Are you sure?")){
           jQuery.post("/characters/deleteall",{}, function(){
               window.location.href ="/start";
           });
       }
    });
});