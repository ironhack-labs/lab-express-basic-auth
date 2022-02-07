const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    minlength: [5, "El nombre de usuario debe tener mínimo 5 caracteres"],
    type: String,
    unique: true,
    trim: true,
    required: [true, "Indica nombre de usuario"]
  },
  password: {
    type: String,
    required: [true, "Indica la contraseña"]
  },
  
},
{
  timestamps: true
}

);

const User = model("User", userSchema);

module.exports = User;
