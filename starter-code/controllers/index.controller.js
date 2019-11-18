//Exports
require('dotenv').config();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.home = (req, res) => {
	res.render('index');
};

exports.signUpView = (req, res) => {
	res.render('signup');
};

exports.signUpProcess = (req, res) => {
	const { username, password } = req.body;
	console.log(username, password);
	if (username === '' || password === '') {
		res.render('signup', { errorMessage: 'Email and password required' });
	}

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				const salt = bcrypt.genSaltSync(10);
				const hashPassword = bcrypt.hashSync(password, salt);
				User.create({
					username: username,
					password: hashPassword
				})
					.then(() => {
						res.render('signup', { Message: 'User created' });
					})
					.catch((err) => console.error(err));
			} else {
				res.render('signup', { errorMessage: 'Username in use' });
			}
		})
		.catch((err) => {
			console.error(err);
		});
};

exports.loginView = (req, res) => {
	res.render('login');
};

exports.loginProcess = async (req, res) => {
	const { username, password } = req.body;
	if (username === '' || password === '') {
		res.render('login', { errorMessage: 'Username and password required' });
	}
	//Check if user exists
	const user = await User.findOne({ username });
	if (!user) {
		res.render('login', { errorMessage: "Error: Username doesn't exist" });
	}
	//Check password
	if (bcrypt.compareSync(password, user.password)) {
		req.session.currentUser = user;
		res.redirect('/');
	} else {
		res.render('login', { errorMessage: 'Error: Incorrect Password' });
	}
};

exports.main = (req, res) => {
	res.render('main');
};

exports.private = (req, res) => {
	res.render('private');
};
