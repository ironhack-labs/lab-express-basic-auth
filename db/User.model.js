const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
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
    },
    {
      timestamps: true
    }
  );

const User = mongoose.model('User', userSchema);

module.exports = User;