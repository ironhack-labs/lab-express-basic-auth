const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    unique: true
  },
  password: String
});

const User = model("email", userSchema);

module.exports = User;
