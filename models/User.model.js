const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'non-binary'] },
    firstName: { type: String, required: true },
    lastName: { type: String },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = User;
