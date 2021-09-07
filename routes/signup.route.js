const express = require('express');
const router = express.Router();

// Import user
const User = require('../models/User.model');

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
		.catch((error) => next(error));
});

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

module.exports = router;
