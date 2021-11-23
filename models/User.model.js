const { Schema, model } = require("mongoose");
//const mongoose = require("mongoose");
//const userSchema = new mongoose.Schema ({
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema ({
  username: {
    type: String,
    trim: true,
    required: [true, 'Username is required.'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required.'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
}, 
{
  timestamps: true,
});

// const User = mongoose.model("User", userSchema);

// module.exports = User;
module.exports = model("User", userSchema);
