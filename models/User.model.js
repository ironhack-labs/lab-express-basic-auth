const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const EMAIL_PATTERN = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const SALT_ROUNDS = 10
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    unique: true,
    match: [EMAIL_PATTERN, 'Invalid email']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  } 
},
{
    timestamps: true
});

userSchema.pre("save", function(next) {
  if(this.isModified("password")) {
    bcrypt.hash(this.password, SALT_ROUNDS)
      .then((hash) => {
        this.password = hash

        next()
      })
  } else {
    next()
  }
})

const User = model("User", userSchema);

module.exports = User;
