const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    tim: true,
    required: [true, 'Username is required'],
    minlength: [5, 'The minimum length is 5 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must have at least 8 characters length']
  }
});

const User = model("User", userSchema);

module.exports = User;
