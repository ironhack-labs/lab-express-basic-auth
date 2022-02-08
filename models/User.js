//importacion
const mongoose = require("mongoose")

//esquema
const userSchema = mongoose.Schema({
	username: {
		type: String,
		trim: true, // No puedes guardar en base de datos si mandas un dato con espacios en blanco
		required: true
	},
	password: {
		type: String,
		required: true
	}
}, 	{
		timestamps: true // Guardar la fecha y hora en la cual se creó un documento
	}
)

// modelo
const User = mongoose.model("User", userSchema)

// exportacion
module.exports = User