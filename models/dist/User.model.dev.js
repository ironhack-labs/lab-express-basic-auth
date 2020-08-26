"use strict";

// User model here
var mongoose = require("mongoose");

var _require = require('mongoose'),
    Schema = _require.Schema,
    model = _require.model;

var userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
}, {
  timestamps: true
});
module.exports = model('User', userSchema);