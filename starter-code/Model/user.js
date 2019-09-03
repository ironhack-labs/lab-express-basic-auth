const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userData = new Schema({
  username: String,
  password: String
});

const UserModel = mongoose.model("Users", userData);

module.exports = UserModel;
