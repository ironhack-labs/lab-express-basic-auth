const router = require("express").Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model')

router.get('/signup', (req, res, next) => {
	res.render('signup');
});

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body
	// is the password 4+ characters
	if (password.length < 4) {
		res.render('signup', { message: 'Your password has to be 4 chars min' })
		return
	}
	// is the username not empty
	if (username.length === 0) {
		res.render('signup', { message: 'Your username cannot be empty' })
		return
	}
	// validation passed
	// do we already have a user with that username?
	User.findOne({ username: username })
		.then(userFromDB => {
			// if there is a user
			if (userFromDB !== null) {
				res.render('signup', { message: 'Your username is already taken' })
				return
			} else {
				// we can use that username
				// we hash the password
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({
					username: username,
					password: hash
				})
					.then(createdUser => {
						console.log(createdUser)
						res.redirect('/')
					})
					.catch(err => {
						next(err)
					})
			}
		})
});

router.get('/login', (req, res, next) => {
	res.render('login')
});

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	// do we have a user with that username in the db
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB === null) {
				res.render('login', { message: 'Invalid Credentials' })
				return
			}
			if (bcrypt.compareSync(password, userFromDB.password)) {
				req.session.user = userFromDB
				res.redirect('/main')
			} else {
				// password is not correct
				res.render('login', { message: 'Invalid Crentials' })
			}
		})
});

module.exports = router;
