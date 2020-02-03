const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    username: {type: String, unique:true},
    password: String,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", schema);