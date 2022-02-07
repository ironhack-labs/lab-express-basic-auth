const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  passwordHash: {
    type: String,
  }
},
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
