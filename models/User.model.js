const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username is already in use']
  },
  password: {
    type: String,
    required: true
  }
});

const User = model("User", userSchema);

module.exports = User;
