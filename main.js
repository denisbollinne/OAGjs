var express = require('express')
    , bootstrapper = require('./init/bootstrap.js')
    , mongoose = require('mongoose')
    , app = module.exports =express.createServer();

bootstrapper(app);
User = mongoose.model('User');