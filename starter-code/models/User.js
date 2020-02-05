const mongoose = require('mongoose');

const User = mongoose.Schema({
  username: { type: String, unique: true },
  password: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('User', User);
