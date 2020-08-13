const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Insert Username'],
      unique: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Insert Password']
    }
},
  {
    timestamps: true
  }
  );

module.exports = model('User', userSchema);

