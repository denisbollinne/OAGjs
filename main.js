var express = require('express')
    , resource = require('express-resource')
    , app = express.createServer();

app.resource('characters', require('./resources/characters'));

app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
})

console.log('Server running at http://127.0.0.1:3000/');

app.listen(3000);