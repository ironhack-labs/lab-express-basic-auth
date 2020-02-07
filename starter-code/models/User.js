const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user"
  },
  password: String
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
