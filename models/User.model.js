const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: [true, 'Please input your username.']
  },
  password: {
    type: String,
    require: [true, 'Please input your password.']
  }
});

const User = model("User", userSchema);

module.exports = User;
