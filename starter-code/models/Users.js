const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaUsers = new Schema(
  {
    username: String,
    password: String
  });

const Model = mongoose.model("Users", schemaUsers);
module.exports = Model;
