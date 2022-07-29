const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const EMAIL_PATTERN =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /^.{8,}$/i;
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [EMAIL_PATTERN, "Please insert a valid email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    match: [PASSWORD_PATTERN, "Password must contain at least 8 characters"],
  },
  image: {
    type: String,
    default: "https://i.pravatar.cc/200",
  },
});

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

const User = model("User", userSchema);

module.exports = User;
