const express = require('express');
const router = express.Router();

// Import user
const User = require('../models/User.model');
// Import mongoose
const mongoose = require('mongoose');

// require bcryptJS
const bcryptjs = require('bcryptjs');
// 10 saltrounds
const saltRounds = 10;

// Home GET
router.get('/', (req, res) => res.render('index', { title: 'App created with Ironhack generator 🚀' }));

// Signup GET -------------------------------------------------------------
router.get('/signup', (req, res) => res.render('auth/signup.hbs'));

// Signup POST ------------------------------------------------------------
router.post('/signup', (req, res, next) => {
	const { username, email, password } = req.body;

	// show error if no email or no pass or no name
	if (!username || !email || !password) {
		res.render('auth/signup', {
			errorMessage: 'All fields are mandatory. Please provide your username, email and password.'
		});
		return;
	}

	// make sure passwords are strong:
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	if (!regex.test(password)) {
		res.status(500).render('auth/signup', {
			errorMessage:
				'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.'
		});
		return;
	}

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(password, salt))
		.then((hashedPassword) => {
			return User.create({
				// username: username
				username,
				email,
				// passwordHash => this is the key from the User model
				//     ^
				//     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
				passwordHash: hashedPassword
			});
		})
		.then((userFromDB) => {
			console.log('Newly created user is: ', userFromDB);
			res.redirect('/userProfile');
		})
		.catch((error) => {
			if (error instanceof mongoose.Error.ValidationError) {
				res.status(500).render('auth/signup', { errorMessage: error.message });
			} else if (error.code === 11000) {
				res.status(500).render('auth/signup', {
					errorMessage: 'Username and email need to be unique. Either username or email is already used.'
				});
			} else {
				next(error);
			}
		}); // close .catch()
});

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;
