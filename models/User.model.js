const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "username is requiured"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [EMAIL_PATTERN, "Email is invalid"],
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minLength: [8, "Password must be 8 characters or longer"],
  },
});

UserSchema.pre("save", function (next) {
  const user = this;

  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10).then((hash) => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

UserSchema.methods.checkPassword = function(password){
  return bcrypt.compare(password, this.password)
}


const User = model("User", UserSchema);

module.exports = User;
