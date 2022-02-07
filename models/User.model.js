const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
  username: {
    type: String,
    unique: true,
    required: [true, 'Nombre de usuario'],
  },
  passwordHash:{
    type:String, 
    required: [true, 'Indica la contraseña.']
  }, 
  email: {
    type: String,
    unique:true,
    required: [true, 'Indica el email.'],
  }  
},
{
  timestamps: true
}
);

const User = model("User", userSchema);

module.exports = User;
