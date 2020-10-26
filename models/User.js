// User model here
const mongoose = require("mongoose");
const { use } = require("../routes");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: String,
    password: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema)

module.exports = User;