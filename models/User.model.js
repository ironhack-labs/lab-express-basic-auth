const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Es necesario el username.']
  },
  password: {
    type: String,
    required: [true, 'Se necesita añadir una contraseña']
  }
});

const User = model("User", userSchema);

module.exports = User;
