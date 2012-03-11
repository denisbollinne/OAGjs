var express = require('express')
    , appResource = require('./resource/app-resource.js')
    , url = require('url');

module.exports = function(app,validateAuthentication){
    appResource(app);

    app.resource('/characters', require('./../resources/characters'), validateAuthentication);

    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

}