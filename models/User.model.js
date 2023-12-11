const bcrypt = require("bcryptjs");
const { Schema, model } = require("mongoose");
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

const User = model("User", UserSchema);

module.exports = User;
