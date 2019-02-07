const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    //document structure & rules defined here
    fullName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    encryptedPassword: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["normal", "admin"],
      default: "normal"
    }
  },
  {
    // additional settings for the Schema class defined here
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
