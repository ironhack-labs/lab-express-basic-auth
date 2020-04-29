const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// CREATE SCHEMA
const userSchema = new Schema({
  username: {type: String, required: true, unique:true},
  password: {type: String, required: true}
});


// CREATE MODEL
//                           users
const User = mongoose.model('User', userSchema);


// EXPORT
module.exports = User;