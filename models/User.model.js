const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    minlength: [5, 'El nombre del usuario debe tener mínimo 5 caracteres'],
    type: String,
    trim: true,
    required: [true, 'Indica el nombre de usuario'],
    unique: true
  },
  email: {
    type: String,
    required: [true, 'Indica el email.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: [true, 'Indica la contraseña.']
  }
},
  {
    timestamps: true

  });

const User = model("User", userSchema);

module.exports = User;
