const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {
    userName: {
      type: String,
      required: [true, "Enter a Username?"]
    },

    encryptedPassword: {
      type: String,
      required: [true, "Enter a password!"]
    }
  },
  // 2nd argument -> SETTING object
  {
    // automatically add "createdAt" and "updateAt" Date fields
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
