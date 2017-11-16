const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
      username: {
        type: String,
        required:[true, "Enter your username."]
      },
      encryptedPassword:{
          type: String,
          required: [true, "You need a password"]
      }
  },
  {
      timestamps: true
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
