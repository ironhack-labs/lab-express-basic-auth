const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    match: [/^[A-Za-z0-9]*$/, 'Please use only letters or numbers.'],
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = model('User', userSchema);

module.exports = User;
