const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'El nombre de usuario es obligatorio'],         //estos mensajes aparecen en consola durante signup
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

module.exports = User;
