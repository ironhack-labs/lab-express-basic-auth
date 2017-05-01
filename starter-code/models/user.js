/* jshint esversion: 6 */

const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username:  {type: String, required: [true, "Please enter a valid name"]},
  password: {type: String, required: [true, "Please enter a valid password"]},
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
