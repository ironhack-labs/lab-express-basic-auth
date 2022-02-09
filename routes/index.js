const router = require("express").Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User.model.js')

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("signup");
});

// code from in tutors(Jan) example

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body
	// is the password + 4 chars
	if (password.length < 4) {
		res.render('signup', { message: 'Your password needs to be min 4 chars' })
		return
	}
	if (username.length === 0) {
		res.render('signup', { message: 'Your username cannot be empty' })
		return
	}
	// validation passed
	// do we already have a user with that username in the db?
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB !== null) {
				res.render('signup', { message: 'Username is alredy taken' })
			} else {
				// we can use that username
				// and hash the password
				const salt = bcrypt.genSaltSync()
				const hash = bcrypt.hashSync(password, salt)
				// create the user
				User.create({ username, password: hash })
					.then(createdUser => {
						console.log(createdUser)
						res.redirect('/login')
					})
					.catch(err => next(err))
			}
		})
});

router.post('/login', (req, res, next) => {
	const { username, password } = req.body

	// do we have a user with that username
	User.findOne({ username: username })
		.then(userFromDB => {
			console.log('user: ', userFromDB)
			if (userFromDB === null) {
				// this user does not exist
				res.render('login', { message: 'Invalid credentials' })
				return
			}
			// username is correct 
			// we check the password against the hash in the database
			if (bcrypt.compareSync(password, userFromDB.password)) {
				console.log('authenticated')
				// it matches -> credentials are correct
				// we log the user in
				// req.session.<some key (normally user)>
				req.session.user = userFromDB
				console.log(req.session)
				// redirect to the profile page
				res.redirect('/profile')
			}
		})
});
router.get('/login', (req, res) => {
	res.render('login')
})

// middleware to protect a route
function loginCheck() {
	return (req, res, next) => {
	  // check if we have a logged in user
	  if (req.session.user) {
		// the user making the request is logged in
		// user can proceed
		next()
	  } else {
		// user is not logged in
		res.redirect('/login')
	  }
	}
  }

router.get("/profile", loginCheck(), (req, res, next) => {
	// to set a cookie yourself
	res.cookie('myCookie', 'hello from express')
	// access the cookie -> req.cookies
	console.log('this is the cookie: ', req.cookies)
	// clear the cookie on the client
	res.clearCookie('myCookie')
	const user = req.session.user
	res.render("profile", { user: user });
  });

router.get('/logout', (req, res, next) => {
	// to log the user out we destroy the session
	req.session.destroy()
	res.render('index')
});



module.exports = router;
