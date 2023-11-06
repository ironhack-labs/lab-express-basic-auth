const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Es obligatorio el nombre de usuario'],
    minlength: [4, 'Tu nombre de usuario tiene que tener más de 4 carácteres']
  },
  email: {
    type: String,
    required: [true, 'Es obligatorio indicar el e-mail'],
    unique: true,
    lowecase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Es obligatorio escoger una contraseña'],
    minlength: [8, 'Tu contraseña debe tener más de 8 carácteres']
  },
  spiritAnimal: {
    type: String,
    required: [true, 'Tienes que escoger tu animal espiritual'],
    lowecase: true,
    trim: true,

  },
  phoneNumber: {
    type: Number,
    unique: true,
    required: [true, 'Tienes que introducir tu número de teléfono'],
    minlength: [9, 'Tu número tiene que tener 9 carácteres']
  }
});

const User = model("User", userSchema);

module.exports = User;
