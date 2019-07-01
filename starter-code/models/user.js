const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: String,
    password: String
  },
  {
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
