const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // document structure & rules definde here
    username: { type: String, required: true },
    encryptedPassword: { type: String, required: true }
  },
  {
    // additional settings for Schema class here
    timestamps: true
    //timestamp gives us dates automatically. in this case it would be used as date that the account was created.
  }
);

//"User" model -> "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
