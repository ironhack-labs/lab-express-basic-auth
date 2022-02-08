const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      minlength: [5, 'the username must have minimum 5 characters'],
      type: String,
      trim: true,
      required: [true, 'type your username'],
      unique: true
    },
  
    passwordHash: {
      type: String,
      required: [true, 'type your password']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);