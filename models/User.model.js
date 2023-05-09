const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: String
});

const User = model("User", userSchema);

module.exports = User;
