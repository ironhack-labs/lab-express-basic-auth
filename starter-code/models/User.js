const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    name: String,
    lastname: String,
    country: String,
    username: { type: String, unique: true, index: true },
    password: String,
    accept: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model("user", Schema);
model.collection.createIndexes();

module.exports = model;
