const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, 'Username is already taken.'],
    trim: true,
    required: [true, 'Username is required.']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    match: [/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, 'Please use a valid password.']
  }
});

const User = model("User", userSchema);

module.exports = User;
