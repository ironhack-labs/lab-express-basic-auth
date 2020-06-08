const { Router } = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const router = Router();

const saltRounds = 10;

/* Signup Routes */
router.get('/signup', (req, res, next) => res.render('auth/signup'));
router.post('/signup', async (req, res, next) => {
	//console.log(req.body);
	const { username, email, password } = req.body;
	try {
		validateData({ username, email, password, id }, 'auth/signup');
		const passwordHash = await bcrypt.hashSync(password, saltRounds);
		const newUser = await User.create({
			username: username,
			email: email,
			passwordHash: passwordHash,
		});
		console.log('User created succesfully', newUser);
		res.redirect('/userProfile/' + newUser._id);
	} catch (error) {
		if (error instanceof mongoose.Error.ValidationError) {
			res.status(500).render('auth/signup', {
				errorMessage: error.message,
			});
		} else if (error.code === 11000) {
			res.status(500).render('auth/signup', {
				username: username,
				email: email,
				password: password,
				id: id,
				errorMessage: 'username or email exist...',
			});
		} else {
			next(error);
		}
	}
});

/* User Profile Routes */
router.get('/userProfile/:id', async (req, res, next) => {
	if (req.session.logged && req.session.userId === req.params.id) {
		const user = await User.findById(req.params.id);
		if (user) {
			req.session.userId = user._id;
			res.render('users/user-profile', {
				logged: req.session.logged,
				userId: req.session.userId,
				user: user,
			});
		}
	} else {
		res.redirect('/login');
	}
});
router.post('/userProfile', async (req, res, next) => {
	const { username, email, password, id } = req.body;
	if (req.session.logged && req.session.userId === id) {
		try {
			validateData({ username, email, password, id }, 'users/user-profile');
			const passwordHash = await bcrypt.hashSync(password, saltRounds);
			console.log(passwordHash);
			const editUser = await User.findByIdAndUpdate(id, {
				username: username,
				email: email,
				passwordHash: passwordHash,
			});
			console.log('User updated succesfully', editUser);
			res.redirect('/userProfile/' + id);
		} catch (error) {
			if (error instanceof mongoose.Error.ValidationError) {
				res.status(500).render('user/user-profile', {
					username: username,
					email: email,
					password: password,
					id: id,
					errorMessage: error.message,
				});
			} else if (error.code === 11000) {
				res.status(500).render('user/user-profile', {
					username: username,
					email: email,
					password: password,
					id: id,
					errorMessage: 'username or email exist...',
				});
			} else {
				next(error);
			}
		}
	} else {
		res.redirect('/login');
	}
});

/* Login Routes */
router.get('/login', (req, res, next) => res.render('auth/login'));
router.post('/login', async (req, res, next) => {
	const { email, password } = req.body;
	try {
		if (!email || email.length === 0 || !password || password.length === 0) {
			res.render('auth/login', {
				errorMessage: 'Please enter both, email and password to login',
			});
			return;
		}
		const userLogin = await User.findOne({ email: email });
		if (!userLogin) {
			res.render('auth/login', {
				errorMessage: 'Email is not registered. Try and other email.',
			});
			return;
		} else if (bcrypt.compare(password, userLogin.passwordHash)) {
			req.session.logged = true;
			req.session.userId = userLogin._id;
			res.redirect('/userProfile/' + userLogin._id);
			return;
		} else {
			res.render('auth/login', {
				errorMessage: 'Password incorrect. Try again.',
			});
			return;
		}
	} catch (error) {
		next(error);
	}
});
router.get('/logout', (req, res, next) => {
	req.session.logged = false;
	req.session.userId = null;
	res.redirect('/login');
});

router.get('/main', async (req, res, next) => {
	if (req.session.logged) {
		res.render('private/main', {
			logged: req.session.logged,
			userId: req.session.userId,
		});
	} else {
		res.redirect('/login');
	}
});
router.get('/private', async (req, res, next) => {
	if (req.session.logged) {
		res.render('private/index', {
			logged: req.session.logged,
			userId: req.session.userId,
		});
	} else {
		res.redirect('/login');
	}
});

function validateData(data, urlRender) {
	if (
		!data.username ||
		data.username.length === 0 ||
		!data.email ||
		data.email.length === 0 ||
		!data.password ||
		data.password.length === 0
	) {
		res.render(urlRender, {
			username: data.username,
			email: data.email,
			password: data.password,
			id: data.id,
			errorMessage: 'username, email and password are mandatory',
		});
		return;
	}
	const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	if (!regex.test(data.password)) {
		res.status(500).render(urlRender, {
			username: data.username,
			email: data.email,
			password: data.password,
			id: data.id,
			errorMessage:
				'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.',
		});
		return;
	}
}

module.exports = router;
