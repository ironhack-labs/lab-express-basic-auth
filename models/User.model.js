const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: [true, 'El nombre de usuario no está disponible'],
    required: [true, 'Indica un nombre de usuario']
  },
  password: {
    type: String,
    required: [true, 'Indica una contraseña']
  },
},
  {
    timestamps: true
  });


module.exports = model("User", userSchema);
