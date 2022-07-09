const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  user: {
    type: String,
    unique: true,
    required: true,
    minLength: 4
    },
  password: {
    type: String,
    required: true
  }
});

const User = model("User", userSchema);

module.exports = User;
