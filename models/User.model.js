const { Schema, model } = require("mongoose");


const userSchema = new Schema({
  username: {
    type: String,
   
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
