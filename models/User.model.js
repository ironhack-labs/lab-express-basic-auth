// User model here

const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "User name is mandatory"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "User password is mandatory"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("UserLoginDetails", userSchema);
