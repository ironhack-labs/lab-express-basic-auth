const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    require:true,
  },
  email:{
    type: String,
    require: [true, `Email is require`],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    require: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
