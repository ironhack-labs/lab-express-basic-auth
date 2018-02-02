const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please enter the password"]
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
