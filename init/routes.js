var express = require('express')
    , url = require('url')
    , resource = require('express-resource');

module.exports = function(app){

    app.use(express.static(__dirname+'/public'));

    app.resource('characters', require('./../resources/characters'));

    app.get('/', function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    })

}