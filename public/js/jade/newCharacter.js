/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 5/04/12
 * Time: 19:50
 */

$(document).ready(function(){
    $("#create").click(function(){
       var name = $("#name").val();
        if(name){
            jQuery.post("/characters/create", {name: name, race: "Knight", class:"Warrior"}, function(r){
                window.location.href ="/start";
            });
        }
        else{
            alert("No valid name was given.")
        }
    });
});