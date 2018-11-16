const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
  user : {type: String, unique: true, required: true},
  password: {type: String, required: true}
});

const User = mongoose.model('User', UserSchema);
module.exports = User;