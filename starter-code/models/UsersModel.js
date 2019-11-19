const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username : String, 
  password : String
});

// How is going to create with namee db.
const User = mongoose.model("User", userSchema);

module.exports = User;