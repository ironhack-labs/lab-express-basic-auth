const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const User = require('../models/user');

router.get('/signup', (req, res, next) => {
	res.render('auth/signup', {
		errorMessage: req.flash('error'),
		jsFull: ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'],
		js: ['strength', 'script'],
		css: ['strength'],
	});
});

router.post('/signup', (req, res, next) => {
	const { username, password } = req.body;
	if (username === '' || password === '') {
		req.flash('error', 'You need to fill both fields to sign up !');
		res.redirect('/auth/signup');
		return;
	}

	const salt = bcrypt.genSaltSync(saltRounds);
	const hashPass = bcrypt.hashSync(password, salt);

	User.create({ username, password: hashPass })
		.then(() => {
			req.flash('success', 'Account created !');
			res.redirect('/');
			return;
		})
		.catch((dbError) => {
			req.flash('error', "Hey, seems your username is already taken. You're too late my friend");
			res.redirect('/auto/signup');
		});
});

router.get('/login', (req, res, next) => {
	res.render('auth/login', {
		errorMessage: req.flash('error'),
	});
});

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	if (username === '' || password === '') {
		req.flash('error', 'You need to fill both fields to sign up !');
		res.redirect('/auth/signup');
		return;
	}

	User.findOne({ username })
		.then((findUser) => {
			if (!findUser) {
				req.flash('error', "Don't find credentials... that word là.");
				res.render('auth/login');
				return;
			}
			if (bcrypt.compareSync(password, findUser.password)) {
				req.session.currentUser = findUser;
				res.redirect('/');
			} else {
				req.flash('error', "Don't find credentials... that word là.");
				res.render('auth/login');
				return;
			}
		})
		.catch((dbError) => next(dbError));
});

router.get('/logout', (req, res, next) => {
	req.session.destroy((err) => {
		res.redirect('/');
	});
});

module.exports = router;
