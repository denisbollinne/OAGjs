/**
 * Created by JetBrains WebStorm.
 * User: Denis
 * Date: 1/04/12
 * Time: 11:12
 * To change this template use File | Settings | File Templates.
 */
var mongoose = require('mongoose');
var redisFactory  = require('../init/redisFactory.js')();
var staticClient = redisFactory.CreateClient();

exports.redisClient = staticClient;
exports.mongoose = mongoose;