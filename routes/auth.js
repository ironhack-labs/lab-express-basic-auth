const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
//Encrypt the password
const bcrypt = require("bcryptjs");
const saltRound = 10;

router.get("/signup", (req, res) => {
	res.render("signup");
});

router.post("/signup", (req, res, next) => {
	//const username = req.body.username;
	const { username, password } = req.body;

	//Server validation for empty fields
	if (!username || !password) {
		res.render("signup", { errorMessage: "Username & password is mandatory" });
	}

	User.findOne({ username })
		//username duplicated validation
		.then((user) => {
			if (user) {
				res.render("signup", { errorMessage: "User already exists in DB" });
			}
		})
		.catch((error) => next(error));

	//Encrypting password
	const salt = bcrypt.genSaltSync(saltRound);
	const hashPassword = bcrypt.hashSync(password, salt);

	User.create({ username, password: hashPassword })
		.then(() => {
			res.render("index");
		})
		.catch((error) => next(error));
});

router.get("/login", (req, res) => {
	//Back to private page if user is logged in
	if (req.session.currentUser) {
		res.redirect("/profile/main");
	}

	res.render("login");
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;
	//Server validation for empty fields
	if (!username || !password) {
		res.render("login", { errorMessage: "Username & password is mandatory" });
	}
	User.findOne({ username }).then((user) => {
		if (!user) {
			res.render("login", { errorMessage: "Incorrect Username or Password" });
		}
		//Desencrypting password and comparing it with stored in dB
		const passwordCorrect = bcrypt.compareSync(password, user.password);
		if (passwordCorrect) {
			// Save the user in the property currentUser of session object
			req.session.currentUser = user;
			res.redirect("/profile/main");
		} else {
			res.render("login", { errorMessage: "Incorrect Username or Password" });
		}
	});
});

router.get("/logout", (req, res) => {
	//Destroy the user session if logout
	req.session.destroy((err) => {
		if (err) {
			// If unable to logout the user
			res.redirect("/");
		} else {
			res.redirect("/auth/login");
		}
	});
});

module.exports = router;
