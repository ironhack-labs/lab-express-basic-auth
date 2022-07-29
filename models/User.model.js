const { Schema, model } = require("mongoose");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  firstname: {
    type: String,
    required: [true, 'Firstname is required']
  },
  lastname: {
    type: String,
    required: [true, 'Lastname is required']
  },
  age: {
    type: Number, 
    required: [true, 'Age is required'],
    min: [18, 'You cannot sign up because you are underage. Sorry!']
  },
  email: {
    type: String,
    required: [true, 'E-mail is required'],
    unique: true,
  },
  username: {
    type: String,
    unique: true,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  }  
});

// TO HASH THE PASSWORD BEFORE SAVE ON DB
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