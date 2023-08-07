const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, 'El nombre de usuario es obligatorio'],
      minlength: [6, 'El nombre de usuario debe tener 6 caracteres']

    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
  },

  {
    timestamps: true
  },

)

const User = model("User", userSchema);

module.exports = User;
