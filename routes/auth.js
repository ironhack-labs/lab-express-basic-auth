const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
	res.render('signUp');
});

router.get('/login', (req, res, next) => {
	res.render('login');
});

// Signup

router.post('/signup', (req, res)=> {
	console.log('Hello World', req.body);
	const {username, password} = req.body;

	if (password.length <8) {
		res.render('signUp', { message: 'Minimum password length: 8 chars' });
		return;
	}
	if (username.length=== 0) {
		res.render('signUp', {message: 'Username cannot be empty'});
		return;
	}

	 User.findOne({ username: username })
		.then(userFromDB => {
			console.log('userFromDB', userFromDB);
			/* if (userFromDB !== null) {
				res.render('signUp', {message: 'Username has already been taken.'})
				return;
			
			} else {
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password,salt);
				console.log('hash',hash);
				User.create({username: username, password: hash})
					.then(createdUser => {
						console.log('createdUser', createdUser);
						res.redirect('/login');	
					})
					.catch(err=>{
						next(err);
					})
			} */
		})
		.catch(err=>console.log(err)); 
})

// Login

router.post('/login', (req, res, next)=> {
	const { username, password } = req.body;

	User.findOne ({ username : username })
		.then(userFromDB => {
			if (userFromDB === 0) {
				res.render('login', {message: 'Invalid credentials'});
				return;
			}
			if (bcrypt.compareSync(password,userFromDB.password)) {
				req.session.user = userFromDB;
				res.redirect('/profile');
			} else {
				res.render('login', {message: 'Invalid credentials'});
				return;
			}
		})
})

// Logout

router.get('/logout', (req, res, next) => {
	req.session.destroy(err=>{
		if (err) {
			next(err);
		} else {
			res.redirect('/');
		}
	})
})


module.exports = router; 
