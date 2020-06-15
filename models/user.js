var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    passport: String
});


UserSchema.plugin(passportLocalMongoose);   //add methods to user

module.exports = mongoose.model("User", UserSchema);