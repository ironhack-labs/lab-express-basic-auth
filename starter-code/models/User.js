const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: "Use a different user name",
      required: "Please, provide a user name"
    },
    password: {
      type: String,
      trim: true,
      required: "Please, provide a user name"
    }
  },
  { timestamps: true }
);

var User = mongoose.model('User', UserSchema);


module.exports = mongoose.model("User", userSchema);
