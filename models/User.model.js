const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    trum: true,
    unique: true,
    required: true
  },
  password: String
});

const User = model("User", userSchema);

module.exports = User;
