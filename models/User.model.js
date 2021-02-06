// User model here

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      match: [/^[a-z0-9_-]{3,15}$/, 'Please use a valid username.'],
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true,

    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
