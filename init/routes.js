var express = require('express')
    , appResource = require('./resource/app-resource.js');

module.exports = function(app,validateAuthentication){
    appResource(app);
    var charactersController = require('./../resources/characters.js');
    var positionsController = require('./../resources/positions.js');
    var gamesController = require('./../resources/games.js');
    var arenasController = require('./../resources/arena.js');


    app.get('/characters/select/:name', validateAuthentication, charactersController.select); //select
    app.post('/characters/deleteall', validateAuthentication, charactersController.destroyAll); //deleteAll
    app.get('/characters/position', validateAuthentication, charactersController.position); //position
    app.get('/characters/current', validateAuthentication, charactersController.current); //position
    app.get('/characters/all', validateAuthentication, charactersController.all); //position
    app.post('/characters/create', validateAuthentication, charactersController.create);

    app.get('/games', validateAuthentication, gamesController.index); //all games
    app.get('/games/current', validateAuthentication, gamesController.current); //all games
    app.post('/games/join', validateAuthentication, gamesController.join); //join a game or create one
    app.post('/games/leave', validateAuthentication, gamesController.leave); //leave a game
    app.get('/games/:id', validateAuthentication, gamesController.characters); //all chars in a game

    app.get('/arenas', validateAuthentication, arenasController.index); //all arenas
    app.get('/arenas/new', validateAuthentication, arenasController.new); //show form to create arena
    app.post('/arenas/create', validateAuthentication, arenasController.create); //send form image to create arena
    app.post('/arenas/create/:arenaId', validateAuthentication, arenasController.createInfo); //send metadata to link to the created arena

    app.get('/arenas/:name.json', validateAuthentication, arenasController.get); //get one arena
    app.get('/arenas/:name', validateAuthentication, arenasController.show); //show one arena


    app.resource('/characters', charactersController, validateAuthentication);

    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/lobby',validateAuthentication, function(req,res){
        res.render('lobby');
    });

    app.get('/start',validateAuthentication, function(req,res){
        res.render('characters');
    });

    app.get('/newChar', validateAuthentication, function(req, res){
       res.render('newChar');
    });
    app.get('/login', function (req, res) {
        res.render('users/login');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

};