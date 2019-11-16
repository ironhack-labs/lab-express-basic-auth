const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {type: String, unique: true},
    password: String,
  },
);

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
