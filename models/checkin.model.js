// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
// set up a mongoose model and pass it using module.exports
var model  = new Schema({

    logdate: String, 
    checkin:String,
    checkout:String,
    user: {type: Schema.ObjectId, ref: 'User'}
}, {
    timestamps:true
});





module.exports = mongoose.model('Checkin', model);