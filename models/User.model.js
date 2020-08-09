const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      trim: true,
      unique: true
    },
    passwordHash: { type: String, required: [true, 'Password is required.'] }
  },
  {
    timestamps: true
  }
);

// const User = model('User', userSchema);
// module.exports = User;

// User: model name
// users: collection
module.exports = model('User', userSchema);