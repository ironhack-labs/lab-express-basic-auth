let mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema ({
	username: {
		required: true,
		unique: true,
		type: String,
	},
	name: String,
	lastName: String,
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	description: String,
}, {timestamps:true})

module.exports = mongoose.model('User', userSchema)