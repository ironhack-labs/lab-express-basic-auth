const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const { isValidObjectId } = require('mongoose');
//console.log(User);
const SALT = 15;

router.get("/signin", (req, res, next) => {
	res.render("auth/signin.hbs");
});

router.get("/signup", (req, res, next) => {
	res.render("auth/signup.hbs");
});

router.post("/signup", async (req, res, next) => {

	try {
		const user = req.body;

		if (!user.password || !user.userName) {
			res.render("auth/signup.hbs", {
				errorMessage: "username and password plizzzz",
			});
			return;
		}

		const foundUser = await User.findOne({ username: user.userName });

		if (foundUser) {
			res.render("auth/signup.hbs", {
				errorMessage: "nop. username already taken",
			});
			return;
		}

		const hashedPassword = bcrypt.hashSync(user.password, SALT);
		user.password = hashedPassword;

		const createdUser = await User.create(user);

		res.redirect("/auth/signin");
	}	catch (error) {
		next(error);
	}

});

router.post("/signin", async (req, res, next) => {
	try {
		const foundUser = await User.findOne({ username: req.body.username });

		if (!foundUser) {
			res.render("auth/signin.hbs", {
				errorMessage: "Bad Credentials",
			});
			return;
		}

		const isValidPassword = bcrypt.compareSync(
			req.body.password,
			foundUser.password
		);

		if (isValidPassword) {
			req.session.currentUser = {
				_id: foundUser._id,
			};

			res.redirect('/users/profile');
		} else {
			res.render("auth/signin.hbs", {
				errorMessage: "Bad credentials",
			});
			return;
		}

	} catch (error) {}
});

module.exports = router;