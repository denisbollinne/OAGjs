var express = require('express')
    , appResource = require('./resource/app-resource.js')
    , path = require('path');

module.exports = function(app,validateAuthentication){
    appResource(app);
    var charactersController = require('./../resources/characters');
    var positionsController = require('./../resources/positions');


    app.get('/characters/select/:name', validateAuthentication, charactersController.select); //select
    app.get('/characters/deleteall', validateAuthentication, charactersController.destroyAll); //deleteAll
    app.get('/characters/position', validateAuthentication, charactersController.position); //position
    app.get('/characters/current', validateAuthentication, charactersController.current); //position
    app.get('/characters/all', validateAuthentication, charactersController.all); //position
    app.get('/positions', validateAuthentication, positionsController.index); //all positions
    app.put('/positions', validateAuthentication, positionsController.update); //update selected character's position


    app.resource('/characters', charactersController, validateAuthentication);

    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

}