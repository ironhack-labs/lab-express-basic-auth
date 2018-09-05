const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const userSchema = new Schema({
  // document structure & rules
  username: { type: String, unique: true, required: true },
  encryptedPassword: { type: String, required: true },
}, {
  // additional settings for Schema constructor function (class)
  timestamps: true,
});


const User = mongoose.model("User", userSchema);
module.exports = User;