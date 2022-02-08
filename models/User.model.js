const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: [
        true,
        "that username has already been taken, pick a unique Username",
      ],
      trim: true,
    },
    passwordHash: {
      type: String,
      unique: [true, "that email has already been registered"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
