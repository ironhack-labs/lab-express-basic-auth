const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, 'This username already exists. Please enter a different one.'],
    required: [true, 'Username is mandatory.']
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory. It must have a minimun of 6 characters.']
    
  }
});

const User = model("User", userSchema);

module.exports = User;


