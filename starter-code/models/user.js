const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  user : {type: String, required: true, unique: true},
  password: String
});

const User = mongoose.model('User', UserSchema);
module.exports = User;