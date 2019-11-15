const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema(
  {
    name: String,
    password: String
  }
);

const Model = mongoose.model("Users", schemaName);
module.exports = Model;