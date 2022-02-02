const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Username is required."],
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
