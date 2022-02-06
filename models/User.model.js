const { Schema, model } = require("mongoose");
const bcrypt = require('bcryptjs');

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new Schema({
  name: {
    type: String,
    required: 'name is required',
    minLength: [3, 'name needs at least 3 chars']
  },
  email: {
    type: String,
    required: 'email is required',
    match: [EMAIL_PATTERN, 'email is not valid'],
    unique: true
  },
  password: {
    type: String,
    required: 'password is required',
    match: [PASSWORD_PATTERN, 'password needs at least 8 chars'],
  },
});

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then(hash => {
        user.password = hash;
        next();
      })
      .catch(error => next(error))
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compare(password, this.password)
}

const User = model("User", userSchema);

module.exports = User;
