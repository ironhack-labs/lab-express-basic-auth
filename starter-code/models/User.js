const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
