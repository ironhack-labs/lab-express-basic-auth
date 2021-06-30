const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true                 // -> Ideally, should be unique, but its up to you
  },
  password:{
    type: String,
    require: true,
  },
  email:{
    type: String,
  },
  role: String                   //Admin, Reader, Guest, Superuser
});

const User = model("User", userSchema);

module.exports = User;
