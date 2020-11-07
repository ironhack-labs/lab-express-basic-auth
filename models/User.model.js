const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    minLength: 4,
  },
  password: {
    type: String,
    require: true,
    minLength: 8,
  }
});

module.exports = model('User', userSchema);
