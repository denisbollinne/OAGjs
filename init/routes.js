var express = require('express')
    , appResource = require('./resource/app-resource.js')
    , path = require('path');

module.exports = function(app,validateAuthentication){
    appResource(app);
    var charactersController = require('./../resources/characters');


    app.get('/characters/select/:name', validateAuthentication, charactersController.select); //select
    app.get('/characters/deleteall', validateAuthentication, charactersController.destroyAll); //deleteAll
    app.get('/characters/position', validateAuthentication, charactersController.position); //position


    app.resource('/characters', charactersController, validateAuthentication);

    app.get('/', function (req, res) {
        res.render('home');
    });

//    app.get('/game.html' ,validateAuthentication,function(req,res){
//        var filepath = path.normalize( __dirname + "/../public/game.html");
//        res.sendfile( filepath );
//    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

}