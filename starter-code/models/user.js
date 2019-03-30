const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, required: true, unique: true, minlength: 1},
  password: {type: String, required: true, minlength: 1}
  //minlength otherwise an empty password is also accepted
},{
  timestamps: true
});

const User = mongoose.model('user', userSchema);

module.exports = User;