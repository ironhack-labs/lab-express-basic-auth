const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
	username: String,
	email: {
		type: String,
		required: [true, "Email es requerido."], // QUE NO ESTÉ VACÍO
		match: [/^\S+@\S+\.\S+$/, "Por favor, ingresa un email válido."], // REGEX DEL EMAIL
		unique: true, // EMAIL ÚNICO EN LA BASE DE DATOS
		lowercase: true, // MINÚSCULAS
		trim: true // SIN ESPACIOS VACÍOS
	},
	passwordEncriptado: String
})

// 3. MODELO
const User = model("User", userSchema)

// 4. EXPORTACIÓN
module.exports = User 