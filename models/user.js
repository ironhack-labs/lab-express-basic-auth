'use strict';

// User model goes here

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', schema); 