const express = require('express');
const router = new express.Router();
const requireAuth = require('../middleware/requireAuth');
const protectedRoute = require('../middleware/requireAdmin');

router.get('/auth', (req, res, next) => {
	res.render('./auth/signup');
});

// User model
const User = require('../models/user');

// BCrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// check if user and psw are not empty
router.post('/signup', (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const salt = bcrypt.genSaltSync(bcryptSalt);
	const hashPass = bcrypt.hashSync(password, salt);

	if (username === '' || password === '') {
		res.render('auth/signup', {
			errorMessage: 'Indicate a username and a password to sign up'
		});
		return;
	}
	// check if user already exist in the DB
	User.findOne({ username: username })
		.then((user) => {
			if (user !== null) {
				res.render('auth/signup', {
					errorMessage: 'The username already exists!'
				});
				return;
			}

			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);

			User.create({
				username,
				password: hashPass
			})
				.then(() => {
					res.redirect('/');
				})
				.catch((error) => {
					console.log(error);
				});
		})
		.catch((error) => {
			next(error);
		});
});

router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		res.redirect('/');
	});
});

module.exports = router;
