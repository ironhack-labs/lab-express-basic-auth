const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../../models/User.model");
const mongoose = require('mongoose');

router.get("/signup", (req, res, next) => {
	res.render("auth-views/signup");
});

router.post("/signup", (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.render("auth-views/signup", {
			errorMessage: "All fields are mandatory. Please provide a username and password.",
		});
	}

	 // make sure passwords are strong:
	 const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
	 if (!regex.test(password)) {
	   res
		 .status(500)
		 .render('auth-views/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
	   return;
	 }

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(password, salt))
		.then((hashedPassword) => {
			console.log(hashedPassword);

			return User.create({
				username,
				passwordHash: hashedPassword,
			});
		})
		.then(user => {
			console.log('Newly created user is: ', user);
			res.redirect('/auth/signup');
		  })
		.catch(error => {
			if (error instanceof mongoose.Error.ValidationError) {
			  res.status(500).render('auth-views/signup', { errorMessage: error.message });
			} else if (error.code === 11000) {
			  res.status(500).render('auth-views/signup', {
				errorMessage: 'Username needs to be unique. Username is already in use.'
			  });
			} else {
			  next(error);
			}
		  });
});

router.get("/login", (req, res, next) => {
	res.render("auth-views/login");
});

router.post("/login", (req, res, next) => {
	console.log("SESSION =====> ", req.session);
	const { username, password } = req.body;

	if (username === "" || password === "") {
		res.render("auth-view/login", {
			errorMessage: "Please enter both username and password.",
		});
		return;
	}

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.render("auth-views/login", {
					errorMessage: "Username is not registered. Try again.",
				});
				return;
			} else if (bcryptjs.compareSync(password, user.passwordHash)) {
				req.session.currentUser = user;
				res.redirect("/auth/userProfile");
			} else {
				res.render("auth-views/login", { errorMessage: "Incorrect password." });
			}
		})
		.catch((err) => next(err));
});

router.get("/userProfile", (req, res) => {
	res.render("user-views/userProfile", { userInSession: req.session.currentUser });
});

router.post('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/');
  });

module.exports = router;
