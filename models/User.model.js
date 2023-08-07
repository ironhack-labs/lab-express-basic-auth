const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    required: (true, 'el nombre del usuario no esta registrado'),
    minlength: [5, 'el nombe debe tener min 5 caracter'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'la contraseña es obligatoria']
  },

}, {
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
