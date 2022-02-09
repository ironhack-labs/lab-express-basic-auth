const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, "You must include a username."],
  },
  password: {
    type: String,
    required: [true, "You must include a password."],
  },
});

const User = model("User", userSchema);

module.exports = User;
