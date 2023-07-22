const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    unique: true,
    required: [true, 'Usernames is mandatory.'],
    trim: true,
    
  },
  passwordhash:{
    type: String,
    required: [true, 'Password is mandatory']
  }
  
});

const User = model("User", userSchema);

module.exports = User;
