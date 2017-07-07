const express = require('express');
const authController = express.Router();

const User = require('../models/user');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const salt = bcrypt.genSaltSync(saltRounds);

authController.get('/signup', function (req, res, next) {
	res.render('auth/signup', {});
});

authController.post('/signup', function (req, res, next) {
	let { username, password } = req.body;

	if (username === "" || password === "") {
		res.render('auth/signup', {
			errorMessage: "Indicate a username and a passwor to sign up"
		});
		return;
	}
	User.findOne({ username }, "username", (err, user) => {
		if (user !== null) {
			res.render('auth/signup', {
				errorMessage: "The username already exist"
			});
			return;
		}

		var hashPass = bcrypt.hashSync(password, salt);

		var newUser = new User({
			username,
			password: hashPass
		});

		newUser.save((err) => {
			if (err) {
				res.render('auth/signup', {
					errorMessage: "Someting went wrong while signing up"
				});
				return;
			} else {
				res.render('auth/signup', {
					errorMessage: "The user has been created successfully"
				});
			}
		})
	})
});

authController.get('/signup', function (req, res, next) {
	res.render('auth/signup', {});
});

module.exports = authController;
