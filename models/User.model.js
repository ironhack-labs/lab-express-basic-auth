const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    trim: true
  }
});

const User = model("User", userSchema);

module.exports = User;
