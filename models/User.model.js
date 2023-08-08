const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Debe escribir un nombre de usuario'],
		unique: [true, 'El nombre de usuario ya está cogido.'],
	},
	password: String,
})

module.exports = model('User', userSchema)
