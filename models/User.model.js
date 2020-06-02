// User model here
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter username'],
      unique: true
    },
    email: {
      type: String,
      required:[true, 'Please enter email'],
      unique:[true, 'Email registered.  Please use another.']
    },
    passwordHash: {
        type: String,
        required:true
    }
  },
  {
    timestamps: true
  }
);

 module.exports = model('User', userSchema);