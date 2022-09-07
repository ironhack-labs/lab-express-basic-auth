const router = require("express").Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')

router.get('/signup', (req, res, next) => {
	res.render('signup')
});

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body
	//validation
	if (password.length < 4) {
		res.render('signup', { message: 'Password has to be 4  chars min' })
		return
	}
	// check if username is not empty
	if (username === '') {
		res.render('signup', { message: 'Username cannot be empty' })
		return
	}
	// validation passed
	// check if the username is already used
	User.findOne({ username: username })
		.then(userFromDB => {
			console.log(userFromDB)
			if (userFromDB !== null) {
				res.render('signup', { message: 'Your username is already taken' })
			} else {
				// we can use that username
				// hash the password
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				console.log(hash)
				// create the user
				User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
						res.redirect('/auth/login')
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
	const { username, password } = req.body
	// do we have a user with that username in the db
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB === null) {
				// username is not correct -> show the login form again
				res.render('login', { message: 'Wrong credentials' })
				return
			}
			// username is correct
			// check if the password from the input form matches the hash from the db
			if (bcrypt.compareSync(password, userFromDB.password)) {
				// the password is correct -> the user can be logged in
				// req.session is an object provided to us by 'express-session'
				// this is how we log the user in:
				req.session.user = userFromDB
				res.redirect('/main')
			} else {
				res.render('login', { message: 'Wrong credentials' })
				return
			}
		})
});


module.exports = router;