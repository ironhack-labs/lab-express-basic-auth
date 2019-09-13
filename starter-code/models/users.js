const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema(
  {
    username: String,
    password: String
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("Users", schemaName);
module.exports = Model;
