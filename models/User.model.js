// User model here

const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: [true, 'E-mail is required.'],
      unique: true
    },
    firstname: {
        type: String,
        trim: true,
        required: [true, 'Firstname is required.'],
    },
    lastname: {
        type: String,
        trim: true,
        required: [true, 'Lastname is required.'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
