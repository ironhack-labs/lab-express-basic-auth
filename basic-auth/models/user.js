const moongose = require('mongoose');

const Schema = moongose.Schema;
const userSchema = new Schema({
  username: String,
  password: String,
});

const User = moongose.model('User', userSchema);

module.exports = User;
