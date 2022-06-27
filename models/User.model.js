const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'You cannot register without providing a unique username.']
  },
  password: {
    type: String,
    required: [true, 'Password is required to register.']
  }
}, {
  timestamps: true
});

const User = model("User", userSchema);

module.exports = User;
