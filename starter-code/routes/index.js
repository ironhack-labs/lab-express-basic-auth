const express = require('express');
const router  = express.Router();
const app = express();

const bcrypt = require("bcrypt");
const bcryptSalt     = 5;

const User = require("../models/User")

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.post('/signup', (req, res, next) => {
	let username = req.body.user;
	let password = req.body.password;

	if (username === "" || password === "") {
		res.render("signup", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({ "user": username })
	.then(user => {
		if (user !== null) {
				res.render("signup", {
					errorMessage: "The username already exists!"
				});
				return;
			}

			const salt     = bcrypt.genSaltSync(bcryptSalt);
			const hashPass = bcrypt.hashSync(password, salt);

			const newUser = User();

			newUser.user = username;
			newUser.password = hashPass;

			newUser.save()
				.then(user => {
					res.render("index", {message: "User created"});
				}).catch(error => {next(error);})
	})
	.catch(error => {next(error);})
});

module.exports = router;
