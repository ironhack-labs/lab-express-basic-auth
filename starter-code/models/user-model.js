const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema =  new Schema(
  {
    userName: {
      type: String,
      required: [true, "Create a username"]
    },
    encryptedPassword: {
      type: String,
      required: [true, "We need a password"]
    }
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
