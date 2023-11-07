const { Schema, model } = require("mongoose");


const userSchema = new Schema({

  email: {
    type: String,
    required: [true, 'El email de usuario es obligatorio.'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String
  }

});



const User = model("User", userSchema);

module.exports = User;
