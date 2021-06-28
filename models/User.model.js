// TODO: Please make sure you edit the user model to whatever makes sense in this case

const mongoose = require('mongoose');
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10;
const bcrypt = require("bcrypt");



const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Please, enter your username"]
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Please, enter your password"]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [EMAIL_PATTERN, "Please, enter your emailInvalid email pattern"]
  }
}, {
  timetamps: true
})

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) => {
      this.password = hash;
      next();
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;