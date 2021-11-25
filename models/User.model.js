const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: String,
  mail: {
    type: String,
    required: [true, "Email es requerido."],
    match: [/^\S+@\S+\.\S+$/, "Por favor, ingresa un email válido."], //regex del email
    unique: true, //unico email en la base de datos
    lowercase: true, //minúsculas
    trim: true //sin espacios vacios
  },
  passwordEncriptado: String,
});

const User = model("User", userSchema);

module.exports = User;
