const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

  email :{ type: String, required: true, unique: true },
  password :{ type: String, required: true },      

  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user"
  },
  avatar: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/svg/img_258083.png"
  } 
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
