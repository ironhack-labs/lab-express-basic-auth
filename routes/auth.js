const router = require("express").Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
	res.render('signup');
});

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body;
	console.log('username: ' + username + " / password: " + password)
	if (password.length < 8) {
		res.render('signup', { message: 'Your password needs to have at least 8 characters' });
		return;
	}
	// check if the username is empty
	if (username.length === 0) {
		res.render('signup', { message: 'Please enter a username' });
		return;
	}
	// validation passed - username and password are in the correct format
	// we now check if that username already exists
	User.findOne({ username })
		.then(userFromDB => {
			// if user exists
			if (userFromDB !== null) {
				// we render signup again	
				console.log('this username is already taken')
				res.render('signup', { message: 'This username is already taken' });
			} else {
				// if we reach this point this username can be used 
				// we hash the password and create the user in the database
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt);
				// console.log(hash);
				User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log('created user: ' + createdUser);
						res.redirect('/');
					})
					.catch(err => {
						console.log(err);
					})
			}
		})
});

module.exports = router;
