const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs")
const SALT_ROUNDS = 10

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
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

userSchema.methods.checkPassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

const User = model("User", userSchema);

module.exports = User;
