const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'El nombre de usuario es obligatorio'],
    minlength: [3, 'El nombre de usuario es demasiado corto']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria.']
  }
});

const User = model("User", userSchema);

module.exports = User;
