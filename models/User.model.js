// User model here
const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema ({
    username: {type: String, required: true},
    password: {type: String, required: true},
})

//Crear un juego a partir del modelo primer argumento nombre de la coleccion que va a crear y segundo el schema
const User = mongoose.model("User", userSchema)

//Para poder usarlo en app.js
module.exports = User