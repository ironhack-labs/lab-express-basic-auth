// User model here

const { model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "please enter your email"],
    },
    password: {
      type: String,
      required: [true, "error"],
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
