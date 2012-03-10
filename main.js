var express = require('express')
    , bootstrapper = require('./init/bootstrap.js')
    , app = module.exports =express.createServer(express.logger());

bootstrapper(app);