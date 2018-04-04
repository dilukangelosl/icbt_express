// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
// set up a mongoose model and pass it using module.exports
var model  = new Schema({

    name: String, 
    phone:Number,
    email:String,
    password: String,
    active:{type:Boolean,default:false},
    activateToken:String,
    passwordReset:String

},
{
    timestamps:true
});



model.statics.encrypt = (password) => {
    return bcrypt.hashSync(password,5);
}
model.methods.compare = (password,hashpassword, callback) => {
   
    bcrypt.compare(password, hashpassword, function(err, isMatch) {
       
        if (err) return callback(err, null);
        callback(null, isMatch);
    });
}

module.exports = mongoose.model('User', model);