const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, 'This username already exists']
  },
  password: {
    type: String,
    required: [true, 'Password is required'], 
    minlength: [8, 'Your password must have at least 8 characters']
  }
});

userSchema.pre('save', function(next) {
  const rawPassword = this.password;
  if (this.isModified('password')) {
    bcrypt.hash(rawPassword, SALT_ROUNDS)
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