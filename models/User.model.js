const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, 'Email needed']
    },
    password: {
      type: String,
      required: [true, 'Password needed']
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    address: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
