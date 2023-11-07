const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'User obligatorio']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email obligatorio'],
    trim: true
  },
  password: String
});


module.exports = model('User', userSchema);
