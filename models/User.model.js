
const mongoose = require("mongoose");

const newUserModel  = new mongoose.Schema({
  user: {
   type: String,
   require: true,
   unique: true,
   trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
  }
});


module.exports = mongoose.model("NewUserModel", newUserModel)
