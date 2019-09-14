const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usersModel = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("Users", usersModel);
module.exports = Model;
