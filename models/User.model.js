const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'El nombre de usuario es obligatorio'],
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