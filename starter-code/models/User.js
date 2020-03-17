const mongoose = require("mongoose");


const User = mongoose.model("users" ,{
  username: String,
  password: String,
});


module.exports = User;