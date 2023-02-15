const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Please submit a username'], //for: if the user doesn't input a username, this warning shows up 
  },
  password: {
    type: String,
    required: true,
  }
},  {
  timestamps: true
}


);
//we gave the model name= User
const User = model("User", userSchema);
//we export to our project all the data from this model in the form of model name User
module.exports = User;
