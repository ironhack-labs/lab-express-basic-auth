const mongoose = require("mongoose");

const User = mongoose.model("users" ,{
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = User;