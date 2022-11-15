const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  email:{
    type:String,
    unique: true,
    match:/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ ,
    trim: true
  },
  passwordHash: String
});

const User = model("User", userSchema);

module.exports = User;
