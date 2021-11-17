const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) => {
	res.render("auth/signup");
});

router.get('/profile', (req, res) => res.render('users/profile'));

router.post('/signup', (req, res, next) => {
	const{ username, password } = req.body;
	if (password.length < 4) {
		res.render('auth/signup', { message: 'Your password needs to be 4 chars min' })
		return
	}
	if (username.length === 0) {
		res.render('auth/signup', { message: 'Your username cannot be empty' })
		return
	}
	User.findOne({ username: username })
		.then(userFromDB => {
			// if there is a user
			if (userFromDB !== null) {
				res.render('auth/signup', { message: 'Your username is already taken' })
			} else {
				// the username can be used
				// we hash the password 
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username: username, password: hash }).then(createdUser => {
						console.log(createdUser)
						res.redirect('/profile')
					}).catch(err => next(err))
			}
		})
  });






module.exports = router;


