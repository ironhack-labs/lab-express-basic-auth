// User model here
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, "Add username"],
      unique: true,
    },
    
    // 1. Add passwordHash property here
    passwordHash: { type: String, required: [true, "Password is required."] },
  }
);

module.exports = model("User", userSchema)