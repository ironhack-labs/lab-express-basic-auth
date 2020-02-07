const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: "Username is required",
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: "Password is required"
    }
  },
  {
    timestamps: true
  }
);

const model = mongoose.model("User", userSchema);

model.collection.createIndexes();

module.exports = model;
