const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, index: true },
    password: String
  },
  {
    timestamps: true
  }
);

const model = mongoose.model("user", Schema);
model.collection.createIndexes();

module.exports = model;
