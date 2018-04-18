'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true
  }
});

const user = mongoose.model('user', userSchema);

module.exports = user;
