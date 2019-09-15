const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String,
    name: String
  },
  {
    timestamps: true
  }
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
