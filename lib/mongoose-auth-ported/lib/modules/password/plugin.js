define(function (require, exports, module) {
var crypto = require('crypto');

var _schema = require('./schema.js')
  , everyauth = require('everyauth')
  , authenticate;


exports = module.exports = function (schema, opts) {
  schema.add(_schema);

  schema.virtual('password').get( function () {
    return this._password;
  }).set( function (password) {
    this._password = password;
    this.hash =crypto.createHash('sha512').update(password).digest('hex');
  });

  schema.method('authenticate', function (password, callback) {

    var isPasswordEquals =  crypto.createHash('sha512').update(password).digest('hex') === this.hash
      var err;
      if(isPasswordEquals ===false)
      {
          err = 'Invalid password';
      }
      callback(err,isPasswordEquals);
  });


  schema.static('authenticate', exports.authenticate);
};

exports.authenticate = function (login, password, callback) {
  // TODO This will break if we change everyauth's
  //      configurable loginName
  var query = {};
  query[everyauth.password.loginKey()] = login;
  this.findOne(query, function (err, user) {
    if (err) return callback(err);
    if (!user) return callback('User with login ' + login + ' does not exist');
    user.authenticate(password, function (err, didSucceed) {
      if (err) return callback(err);
      if (didSucceed) return callback(null, user);
      return callback(null, null);
    });
  });
};

});
