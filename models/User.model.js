const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_WORK_FACTOR = 10;
const EMAIL_PATTERN = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [EMAIL_PATTERN, "Email is invalid"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must be 8 characters or longer"],
  },
  activationToken: {
    type: String,
    default: () => {
      return (
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
      );
    },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt
      .hash(this.password, SALT_WORK_FACTOR)
      .then((hash) => {
        this.password = hash;
        next();
      })
      .catch((error) => next(error));
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function (passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
