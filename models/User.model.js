const { Schema, model } = require("mongoose");

// creating the model
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "Username is requires"]
  },
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
});

const User = model("User", userSchema);

module.exports = User;
