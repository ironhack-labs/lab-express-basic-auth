const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
       required: [true, "Please pick a username."]
    },
    encryptedPassword: {
      type: String,
      required: [true, "Please make a password."]
    }
  },
  {
    timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
