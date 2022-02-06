const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require("bcryptjs");

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is a required field"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is a required field"],
      match: EMAIL_PATTERN,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is a required field"],
      match: [PASSWORD_PATTERN, "Password must contain at least 8 chars!"],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt
      .hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash;
        next();
      })
      .catch((err) => next(err));
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (password) {
return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema);

module.exports = User;
