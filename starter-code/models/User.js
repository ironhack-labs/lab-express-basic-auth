const mongoose = require("mongoose");

const userSchema = new mongoose.Schema (
  {
    username: {
      type: String,
      required: "Username is required",
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: "Username is required",
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);;
