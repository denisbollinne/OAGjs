var express = require('express')
    , bootstrapper = require('./init/bootstrap.js')
    , app = module.exports =express();

bootstrapper(app);