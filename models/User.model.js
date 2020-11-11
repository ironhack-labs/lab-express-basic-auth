const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please add username"],
    unique: true,
  },
  passwordHash: {
    type: String,
    required: [true, "Please add password"],
  },
});

module.exports = model("User", userSchema);
