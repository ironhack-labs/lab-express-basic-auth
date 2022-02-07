const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    require: [true, 'Tienes que tener un nombre usuario!'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Debes indicar una contraseña']
  }
},
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema)
