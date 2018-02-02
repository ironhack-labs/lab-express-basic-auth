const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please enter your name"]
  },
  password: {
    type: String,
    required: [true, "Please enter your passeword"]
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
