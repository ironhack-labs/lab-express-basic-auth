const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  usuario: {
    type: String,
    unique: true,
    required: true,
    minLength: 4
  },
  contrasena: {
    type: String,
    required: true,
  }
});

const User = model("User", userSchema);

module.exports = User;
