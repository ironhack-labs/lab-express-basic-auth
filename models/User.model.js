const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

// reyes for email
const EMAIL_PATTERN =
	/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

//reyes for password
const PASSWORD_PATTERN = /^.{8,}$/i;

const SALT_ROUNDS = 10;

const userSchema = new Schema({
	username: {
		type: String,
		unique: true,
		minLength: [3, "username must contain at least 3 characters"],
	},
	email: {
		type: String,
		required: [true, "email is required"],
		unique: true,
		match: [EMAIL_PATTERN, "Email pattern does not match"],
	},
	password: {
		type: String,
		required: [true, "Password is required"],
		match: [PASSWORD_PATTERN, "Password must contain 8 characters"],
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
