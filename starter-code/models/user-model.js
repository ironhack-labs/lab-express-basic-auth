const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		minlength: 3
	},
	surname: {
		type: String
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		// https://stackoverflow.com/a/46181/3468846
		minlength: 5
	},
	terms: {
		type: Boolean,
		default: false
	},
	role: {
		type: String,
		required: true,
		enum: ["super", "admin", "editor", "regular"],
		default: "regular"

	},
	encryptedPassword: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;