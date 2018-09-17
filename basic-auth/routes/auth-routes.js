const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/signup", (req, res, next) => {
	res.render("auth/signup");
});

authRoutes.get("/login", (req, res, next) => {
	res.render("auth/login");
});


authRoutes.post("/signup", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const salt = bcrypt.genSaltSync(bcryptSalt);
	const hashPass = bcrypt.hashSync(password, salt);

	const newUser = User({
		username,
		password: hashPass
	});

	if (username === "" || password === "") {
		res.render("auth/signup", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({
			"username": username
		})
		.then(user => {
			if (user !== null) {
				res.render("auth/signup", {
					errorMessage: "The username already exists"
				});
				return;
			}

			newUser.save()
				.then(user => {
					res.redirect("/");
				})
				.catch(err => {
					next(err)
				})
		})
		.catch(err => {
			next(err)
		})
});

authRoutes.post("/login", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	let err = false; 

	if (username === "" || password === "") {
		err = true;
		res.render("auth/login", {
			errorMessage: "Indicate a username and a password to sign up"
		});
		return;
	}

	User.findOne({
			"username": username
		})
		.then(user => {
			if (err || !user) {
				res.render("auth/login", {
					errorMessage: "The username doesn't exist"
				});
				return;
			}
			if (bcrypt.compareSync(password, user.password)) {
				// Save the login in the session!
				req.session.currentUser = user;
				res.render("./home");
			} else {
				res.render("auth/login", {
					errorMessage: "Incorrect password"
				});
			}
		})
		.catch(err => {
			next(err)
		})
});

module.exports = authRoutes;