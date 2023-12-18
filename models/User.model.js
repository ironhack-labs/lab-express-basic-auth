const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS  = 10;
const EMAIL_PATTERN =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = mongoose.Schema({
  username: {
    type: String
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
  }
}); 

userSchema.pre("save", function (next) {
  console.log('entro al presave');
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

const User = mongoose.model("User", userSchema);

module.exports = User;
