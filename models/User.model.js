// User model here
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      require: [true, "User name is require."],
      unique: true,
    },

    passwordHash: {
      type: String,
      require: [true, "Password is required."],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model("User", userSchema);
