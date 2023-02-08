const { Schema, model } = require('mongoose');

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required'],
    trim: true,
  },
  // email: {
  //   type: String,
  //   unique: true,
  //   required: [true, 'Email is required'],
  //   trim: true,
  //   match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  // },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});

const User = model('User', userSchema);

module.exports = User;
