const { Schema, model } = require("mongoose");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required.'],
  },
  password: {
  type: String,
  required: [true, 'Password is required.'],
  minlength: [8, 'Your password must have at least 8 characters']
  },
  email: {
    type: String,
    match: EMAIL_PATTERN,
    required: [true, 'Email is required'],
    unique: [true, 'Email is already in use'],
  },
});

userSchema.pre('save', function(next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {
    bcryptjs.hash(rawPassword, saltRounds)
      .then(hash => {
        this.password = hash;
        next()
      })
      .catch(err => next(err))
  } else {
    next();
  }
});

const User = model("User", userSchema);

module.exports = User;
