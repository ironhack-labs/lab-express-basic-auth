const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
    minLength: 6
  }
});

const User = model("User", userSchema);

module.exports = User;
