var express = require('express')
    , appResource = require('./resource/app-resource.js')
    , url = require('url');

module.exports = function(app){
    appResource(app);

    app.use(express.static(__dirname+'/public'));

    app.resource('/characters', require('./../resources/characters'));

    app.get('/', function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    })

}