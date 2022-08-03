const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'please enter a username']
  },
  password: {
    type: String,
  required: [true, 'please enter a password']
}});

const User = model("User", userSchema);

module.exports = User;
