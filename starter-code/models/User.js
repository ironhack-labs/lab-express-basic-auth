const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }]
});

const User = new mongoose.model("User", userSchema);

module.exports = User;