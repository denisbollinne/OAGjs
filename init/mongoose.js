var mongoose = require('mongoose')
    mongooseAuth = require('../lib/index'),
    UserSchema = require('./mongoose/schema/user.js');

module.exports = function(app){

   mongoose.model('User', UserSchema);
   mongoose.connect(app.set('db-uri'));

   app.use(mongooseAuth.middleware());

   mongooseAuth.helpExpress(app);

};