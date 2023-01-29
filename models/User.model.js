const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10; // Cuantas veces se hashea el codigo (esta bien entre 10-14)
const EMAIL_PATTERN =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new mongoose.Schema( 
  {
    name: {
    type: String,
    unique: true,
    required: [true, "Name is required"]
  },

    email: {
      type: String,
      match: EMAIL_PATTERN,
      required: [true, "Email is required"], 
      unique: [true, "Email is already in use"],
    },

  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "Your password must have at least 8 characters"],
  }

});

userSchema.pre("save", function(next){
  const rawPassword = this.password;
  if ( this.isModified("password")){
    bcrypt.hash(rawPassword, SALT_ROUNDS)
    .then(hash => {
      this.password= hash;
      next()
    })
    .catch (err => next(err))
  }
  else{
    next();
  }
});

userSchema.method.checkPassword = function(passwordToCompare){
  return bcrypt.compare(passwordToCompare, this.password)
};

const User = mongoose.model("User", userSchema);

module.exports = User;
