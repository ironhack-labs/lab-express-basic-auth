const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'El usuario es obligatorio'],
      minlength: [3, 'El usuario es demasiado corto'],
      unique: true,
    },
 
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria.']
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User