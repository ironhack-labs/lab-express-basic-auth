const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schemaName = new Schema(
  {
    name: String,
    password: String
  },
  {
    timestamps: true
  }
);

const Model = mongoose.model("users", schemaName);
module.exports = Model;