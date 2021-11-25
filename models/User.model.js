

//1. IMPORTACIONES
const mongoose = require("mongoose")



//2. SCHEMA
const userSchema = mongoose.Schema({
    username: {
      type: String,
    unique: true
    },
    passwordEncriptado:String
})




//3. MODELO

const User = mongoose.model("User", userSchema)



//4. EXPORTACION
module.exports = User