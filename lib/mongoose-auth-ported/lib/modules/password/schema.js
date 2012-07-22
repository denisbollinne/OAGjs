define(function (require, exports, module) {
module.exports = {
    login: { type: String, unique: true }
  , salt: String
  , hash: String
};

});
