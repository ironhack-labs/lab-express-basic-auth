const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    minLenght: 3,
  },

  password: {
    type: String,
    required: true
  }
});

const User = model("User", userSchema);

module.exports = User;
