const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 10

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: false,
  },

  password: {
    type: String,
    required: true,
  }
},
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
