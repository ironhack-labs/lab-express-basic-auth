
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userData = new Schema({
  userName: {type: String, unique: true},
  password: {type: String}
});

const User = mongoose.model("User", userData);

module.exports = User;