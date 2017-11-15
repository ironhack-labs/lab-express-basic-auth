const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    userName: {
      type: String,
      required: [true, "Tell use your name."]
    },
    encryptedPassword: {
      type: String,
      required: [true, "We need a password."]
    }
  },
  {
    // automatically add "createdAt" and "updatedAt" date fields
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
