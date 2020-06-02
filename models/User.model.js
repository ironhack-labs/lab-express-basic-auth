// User model here
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username :{
      type : String,
      required : [true,'please enter username'],
      unique: true
    },
    email : {
      type: String,
      required: [true,'Please enter email'],
      unique: [true, 'Email already user, please try another one, or try to log in']
    },
    passwordHash : {
      type: String,
      required: true
    }
  },
);

 module.exports = model('User', userSchema);
