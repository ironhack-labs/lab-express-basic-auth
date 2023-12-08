const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS  = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  }
}); 

userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
