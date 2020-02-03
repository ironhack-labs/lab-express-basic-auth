const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {tyoe: String, unique:true},
    password: String,
    
    catchPhrase: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", schema);