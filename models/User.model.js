const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");


// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password:{
  type: String,
  required: true,
  minLength: 8,
}
});

const User = model("User", userSchema);

module.exports = User;
