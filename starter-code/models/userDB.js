const mongoose =require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema ({
 
  username: String,
  password: String,
  
  title:String,
  description: String,
  imgName: String,
  imgPath: String,
} , {
  timestamps: true    /// i don't know ????
})






const User = mongoose.model("User", UserSchema);

module.exports = User;   /// link to index.js in const User = require('../models/userDB')