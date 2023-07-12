const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    unique: true
  }
  
  
});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch(error => next(error));
  } else {
    next();
  }
});

const User = model("User", userSchema);

module.exports = User;
