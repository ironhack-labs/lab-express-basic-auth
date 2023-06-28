const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
// creating the model
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    unique: true,
    required: [true, "Username is requires"]
  },
  password: String,
  passwordHash: {
    type: String,
    required: [true, 'Password is required.']
  }
});

const User = model("User", userSchema);

module.exports = User;