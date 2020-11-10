// User model here
const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unigue: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

module.exports = model('User', UserSchema);