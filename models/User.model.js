const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
      required: [true, 'Nombre de usuario obligatorio'],
      minlength: [4, 'Mínimo 4 caracteres']
    },
    password: {
      type: String,
      required: [true, 'Contraseña es obligatoria']
    }

  },
  {

    timestamps: true
  }

);

const User = model("User", userSchema);

module.exports = User;
