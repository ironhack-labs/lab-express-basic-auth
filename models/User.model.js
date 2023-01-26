const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Password is required']
  }
});

userSchema.pre('save', function(next) {
  const unhashedPassword = this.password;
  
  if (this.isModified('password')) {
    bcrypt.hash(unhashedPassword, SALT_ROUNDS)
    .then(hash => {
      this.password = hash;
      next()
    })
    .catch(err => console.error(err))
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
