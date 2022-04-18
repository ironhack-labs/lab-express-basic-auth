const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'El nombre de usuario es obligatorio'],
    minlength: [4, 'El nombre de usuario debe de ser de minimo 4 caractéres']
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'El email es obligatorio'],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria']
  },
});

const User = model("User", userSchema);

module.exports = User;
