const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Se necesita el nombre del usuario'],
      minlength: [3, 'El nombre del usuario es demasiado corto']
    },

    password: {
      type: String,
      required: [true, 'Lacontraseña es obligatoria']
    }
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);

module.exports = User;
