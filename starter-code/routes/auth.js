const express = require('express');
const router = express.Router();

const User = require('../models/user');

const bcrypt = require('bcryptjs');
const bcryptSalt = 10;

const regexTest = RegExp('(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$');


/* GET home page */
router.get('/signup', (req, res, next) => {
	res.render('auth/signup');
});


router.post('/signup', (req, res, next) => {
	const {username, password} = req.body;

	if (username === '' || password === '') {
		res.render('auth/signup', {
			errorMessage: 'Please provide a username and password to sign up'
		});
		return;
	}

	if (!regexTest.test(username)) {
		res.render('auth/signup',  {
			errorMessage: 'Please provide a valid password'
		});
		return;
	}

	User.findOne({username})
		.then(user => {
			if (user !== null) {
				res.render('auth/signup', {
					errorMessage: 'The username already exists!'
				});
				return;
			}

			const salt = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);

			User.create({username, password: hashPass})
				.then((user) => {
					req.session.currentUser = user;
					res.redirect('/main');
				})
				.catch(error => {
					console.log(error);
				});
		})
		.catch(error => {
			next(error);
		});
});


router.get('/login', (req, res) => {
	res.render('auth/login');
});

router.post('/login', (req, res, next) => {
	const {username, password} = req.body;

	if (username === '' || password === '') {
		res.render('auth/login', {
			errorMessage: 'Please provide a username and password to log in'
		});
		return;
	}
	User.findOne({username})
		.then(user => {
			if (!user) {
				res.render('auth/login', {
					errorMessage: 'The username does not exist'
				});
				return;
			}
			if (bcrypt.compareSync(password, user.password)) {
				req.session.currentUser = user;
				res.redirect('/main');
			} else {
				res.render('auth/login', {
					errorMessage: 'Incorrect password'
				});
			}
		})
		.catch(error => {
			next(error);
		});
});



module.exports = router;
