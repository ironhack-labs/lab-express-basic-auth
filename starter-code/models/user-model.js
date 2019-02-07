const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // document structure & rules defined here
    userName: { type: String, required: true, unique: true, minlength: 2 },
    encryptedPassword: { type: String, required: true }
    // role: {
    //   type: String,
    //   required: true,
    //   enum: ["normal", "admin"],
    //   default: "normal"
    // }
  },
  {
    // additional settings for the Schema class defined here
    timestamps: true
  }
);

// "User" model -> "users" collection

const User = mongoose.model("User", userSchema);

module.exports = User;
