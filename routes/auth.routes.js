const express = require("express");
const router = express.Router();

const User = require("./../models/User.model");

const bcryptjs = require("bcryptjs");
const saltRounds = 10;

const { isLoggedOut } = require("../middleware/loggedout-middleware");
const { isLoggedIn } = require("../middleware/loggedin-middleware");

// Signup

router.get("/signup", isLoggedOut, (req, res) => {
	res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
	const { username, initialPassword } = req.body;

	/*
    User.findOne({ username }).then((user) => {
		if (user.username) {
			res.render("auth/login", { errMsg: "Username already in use." });
			return;
		}
	}); 
    */

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(initialPassword, salt))
		.then((hashedPwd) => {
			User.create({ username, password: hashedPwd });
		})
		.then(() => res.redirect("/login"))
		.catch((err) => {
			console.log(err);
			if (err.code === 11000) {
				res.render("auth/signup", { errMsg: "Username already in use." });
			}
		});
});

// Login

router.get("/login", isLoggedOut, (req, res) => {
	res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res) => {
	const { username, initialPassword } = req.body;

	User.findOne({ username })
		.then((user) => {
			if (!user) {
				res.render("auth/login", { errMsg: "Incorrect username." });
				return;
			}

			if (!bcryptjs.compareSync(initialPassword, user.password)) {
				res.render("auth/login", { errMsg: "Incorrect password." });
				return;
			}

			req.session.currentUser = user;
			res.redirect("/profile");
		})
		.catch((err) => console.log(err));
});

// Logout

router.get("/logout", isLoggedIn, (req, res) => {
	req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
