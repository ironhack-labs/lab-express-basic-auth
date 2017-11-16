const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// new Schema({ schema },{ setting })
const userSchema = new Schema(
  // 1st argument -> SCHEMA STRUCTURE
  {

     // User Name
     userName: {
       type: String,
     },
    // Password
     password: {
       type: String,
     }
  }

);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
