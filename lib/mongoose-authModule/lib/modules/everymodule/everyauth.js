define(function (require, exports, module) {
var Promise = require('everyauth').Promise;
var mongoose = require("mongoose");

// Defaults

module.exports = {
  findUserById: function (userId, fn) {
    var User = mongoose.model("User");
    User.findById(userId, fn);
    // For some reason, the 'this' context isn't being set correctly, so hacking this in here for now.
    //this.User()().findById(userId, fn);
  }
};

});
