const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

module.exports = model('User', userSchema);
