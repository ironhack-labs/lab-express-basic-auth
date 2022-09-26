const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  name: String,
  subscribed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = model("User", userSchema);

module.exports = User;
