const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 50,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = model("user", userSchema);

module.exports = User;
