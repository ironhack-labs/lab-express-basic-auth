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
// ---------------------------------------------------------------------------------
// LOGIN
// GET route ==> to display the login form to users
router.get('/login', (req, res) => res.render('auth/login'));
// ---------------------------------------------------------------------------------
// POST route ==> to display the login form to users
router.post('/login', (req, res, next) => {
	const { email, password } = req.body;

	if (email === '' || password === '') {
		res.render('auth/login', {
			errorMessage: 'Please enter both, email and password to login.'
		});
		return;
	}

	User.findOne({ email }) // <== check if there's user with the provided email
		.then((user) => {
			// <== "user" here is just a placeholder and represents the response from the DB
			if (!user) {
				// <== if there's no user with provided email, notify the user who is trying to login
				res.render('auth/login', {
					errorMessage: 'Email is not registered. Try with other email.'
				});
				return;
			} else if (bcryptjs.compareSync(password, user.passwordHash)) {
				// if there's a user, compare provided password
				// with the hashed password saved in the database
				// if the two passwords match, render the user-profile.hbs and
				//                   pass the user object to this view
				//                                 |
				//                                 V
				res.render('users/user-profile', { user });
			} else {
				// if the two passwords DON'T match, render the login form again
				// and send the error message to the user
				res.render('auth/login', { errorMessage: 'Incorrect password.' });
			}
		})
		.catch((error) => next(error));
});
// ---------------------------------------------------------------------------------

module.exports = router;
