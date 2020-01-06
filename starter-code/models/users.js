const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
}, {
  timestamps: true,
});

const Users = model('Users', userSchema);

module.exports = Users;
