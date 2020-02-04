/*jshint esversion: 6 */

const mongoose = require(“mongoose”);

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, index: true },
    password: String,
    visitas: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);
const model = mongoose.model(“user”, schema);
model.collection.createIndexes().catch(e => console.log(e));
module.exports = model;

