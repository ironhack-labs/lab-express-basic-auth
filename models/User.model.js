const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Username is required.'],
  },
  password: {
    type: String,
    required: [true, 'Password is required.']
  }
});

const User = model("User", userSchema);

module.exports = User;
