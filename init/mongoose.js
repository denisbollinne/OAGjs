var mongoose = require('mongoose'),
    conf = require('./authKeys.js');

module.exports = function(app,mongooseAuth){
   var Schema = mongoose.Schema ,
   ObjectId = mongoose.SchemaTypes.ObjectId;


    var UserSchema = new Schema({
        characters : [{ type: ObjectId, ref: 'Character' }]
    })
        , User;

    var CharacterSchema = new Schema({
        name : {type:String, required : true},
        race : {type:String, required:true, enum:['Knight','Skeletton']},
        class : {type:String, required:true, enum:['Warrior','Barbarian']},
        experience : Number,
        user : { type: ObjectId, ref: 'User' , required : true }
    });

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
                myHostname: app.set('host')
                , appId: conf.fb.appId
                , appSecret: conf.fb.appSecret
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
                getLoginPath: '/loginPw'
                , postLoginPath: '/loginPw'
                , loginView: 'users/loginPw.jade'
                , getRegisterPath: '/register'
                , postRegisterPath: '/register'
                , registerView: 'users/register.jade'
                , loginSuccessRedirect: '/'
                , registerSuccessRedirect: '/'
            }
        }
        , google: {
            everyauth: {
                myHostname:  app.set('host')
                , appId: conf.google.clientId
                , appSecret: conf.google.clientSecret
                , redirectPath: '/'
                , scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
            }
        }
    });

    var BouncingBoxSchema = new Schema({
                                           x : {type:Number, required : true},
                                           y: {type:Number, required : true},
                                           r: {type:Number, required : true}
                                       });

    var ArenaSchema = new Schema({
        name : {type:String, required : true},
        imagePath : {type:String, require : true},

        bouncingBoxes : [ BouncingBoxSchema ]
    });



    mongoose.model('User', UserSchema);
    mongoose.model('Character', CharacterSchema);
    mongoose.model('Arena',ArenaSchema);

   mongoose.connect(app.set('db-uri'));

   User = mongoose.model('User');

};


