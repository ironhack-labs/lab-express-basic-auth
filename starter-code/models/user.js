const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: { type: String, unique: true, index: true },
    password: { type: String, require: [true, "Password required"] }
  },
  { timestamps: true }
);

const model = mongoose.model("User", schema);

model.collection.createIndexes();

module.exports = model;
