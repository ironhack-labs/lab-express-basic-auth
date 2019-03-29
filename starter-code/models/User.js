const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user:{
    type:String,
    required:true,
    unique: true
  },
  password:{
    type:String,
    required:true
  }
}.{timestamps:true});

module.exports = mongoose.model("User",userSchema);