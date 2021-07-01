const { Schema, model } = require("mongoose");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10;

const bcrypt = require("bcryptjs")

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email:{
    type: String,
    unique: true,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [EMAIL_PATTERN, 'Invalid email pattern']
  },
  password: {
  type: String,
  unique: true,
  required: [true, "Password is required"],
  minlength: [8, "Password needs at least 8 characters"]
  },
});

userSchema.pre("save", function (next){
  if (this.isModified("password")){
    bcrypt.hash(this.password, SALT_ROUNDS).then((hash) =>{
      this.password = hash;
      next()
    });
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function(passwordToCheck) {
  return bcrypt.compare(passwordToCheck, this.password)
}


const User = model("User", userSchema);

module.exports = User;
