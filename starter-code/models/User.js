const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const UserSchema = new Schema({

  // User unique and required

  user:{type: String, unique:true, required: true},
  password: String
});

const User = mongoose.model("User", UserSchema);

module.exports = User;