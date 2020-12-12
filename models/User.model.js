
const mongoose = require("mongoose");

//const emailRegex = //regular expresion

const newUserModel  = new mongoose.Schema({
  user: {
   type: String,
   require: true,
   unique: true,
   trim: true,
   //match: [emailRegex, "texto a mostrar si falla la comparativa" ]
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true,
    trim: true,
  }
});


module.exports = mongoose.model("NewUserModel", newUserModel)
