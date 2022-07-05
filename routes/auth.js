const router = require("express").Router();
const User = require('../models/User.model')
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard.js');


router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('signup')
})

router.get('/login', isLoggedOut, (req, res, next) => {
	res.render('login');
});

router.get('/profile', isLoggedIn, (req, res, next) => {
	console.log(req.session.user)
	const user = req.session.user
	res.render('profile', {user});
});

router.get('/private', isLoggedIn, (req, res, next) => {
	res.render('private');
});

router.post('/signup', isLoggedOut, (req, res, next) => {
    const {username, password} = req.body;

    if (password.length < 4) {
		res.render('signup', { message: 'Password has to be 4 chars min' })
		return
	}

	if (username === '') {
		res.render('signup', { message: 'Username cannot be empty' })
		return
	}

    User.findOne({username: username})
    .then(userFromDB => {
        if(userFromDB !== null){
            res.render('signup', {message: 'Your username is already taken'})
            return
        } else {
            const salt = bcrypt.genSaltSync()
			const hash = bcrypt.hashSync(password, salt)
			//console.log(hash)
            User.create({ username: username, password: hash })
				.then(createdUser => {
				//console.log(createdUser)
				res.redirect('/login')
				})
				.catch(err => {
						next(err)
				})
        }
    })
})

router.post('/login', isLoggedOut, (req, res, next) => {
	const { username, password } = req.body
	if (username === '' || password === '') {
		res.render('login', { message: 'Please enter both name and password to login.'});
		return;
	  }
	//this is to get the value from the input field!!
	// do we have a user with that username in the db
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB === null) {
				// username is not correct -> show login form again
				res.render('login', { message: 'Invalid credentials' })
				return
			}
			//if the username is correct (if there is a user in DB)
			//if is not null, it means it is already in DB
			// check the password from the form against the hash in the db
			if (bcrypt.compareSync(password, userFromDB.password)) {
				// the password is correct -> the user can be logged in
				// req.session is an obj that is provided by express-session
				req.session.user = userFromDB
				console.log(userFromDB)
				res.redirect('/profile')
			} else {
				res.render('login', { message: 'Incorrect password' })
			  }
		})
		.catch( err => next(err))
});


//we have to make a POST request to /logout route
router.post('/logout', isLoggedIn, (req, res, next) => {
	req.session.destroy(err => {
		if(err) next(err);
		res.redirect('/');
	});
});

module.exports = router;