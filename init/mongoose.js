var mongoose = require('mongoose'),
    conf = require('./authKeys.js');

module.exports = function(app,mongooseAuth){
   var Schema = mongoose.Schema ,
   ObjectId = mongoose.SchemaTypes.ObjectId;

    var UserSchema = new Schema({})
        , User;

    UserSchema.plugin(mongooseAuth, {
        everymodule: {
            everyauth: {
                User: function () {
                    return User;
                }
            }
        }
        , facebook: {
            everyauth: {
                myHostname: 'http://local.host:3000'
                , appId: conf.fb.appId
                , appSecret: conf.fb.appSecret
                , redirectPath: '/'
            }
        }
        , twitter: {
            everyauth: {
                myHostname: 'http://local.host:3000'
                , consumerKey: conf.twit.consumerKey
                , consumerSecret: conf.twit.consumerSecret
                , redirectPath: '/'
            }
        }
        , password: {
            loginWith: 'email'
            , extraParams: {
                phone: String
                , name: {
                    first: String
                    , last: String
                }
            }
            , everyauth: {
                getLoginPath: '/login'
                , postLoginPath: '/login'
                , loginView: 'login.jade'
                , getRegisterPath: '/register'
                , postRegisterPath: '/register'
                , registerView: 'register.jade'
                , loginSuccessRedirect: '/'
                , registerSuccessRedirect: '/'
            }
        }
        , github: {
            everyauth: {
                myHostname: 'http://local.host:3000'
                , appId: conf.github.appId
                , appSecret: conf.github.appSecret
                , redirectPath: '/'
            }
        }
        , instagram: {
            everyauth: {
                myHostname: 'http://local.host:3000'
                , appId: conf.instagram.clientId
                , appSecret: conf.instagram.clientSecret
                , redirectPath: '/'
            }
        }
        , google: {
            everyauth: {
                myHostname: 'http://localhost:3000'
                , appId: conf.google.clientId
                , appSecret: conf.google.clientSecret
                , redirectPath: '/'
                , scope: 'https://www.google.com/m8/feeds'
            }
        }
    });

   mongoose.model('User', UserSchema);

   mongoose.connect(app.set('db-uri'));

   User = mongoose.model('User');

};

