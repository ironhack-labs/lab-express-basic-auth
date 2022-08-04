const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const mongoose = require("mongoose");
const { isLoggedIn, isLoggedOut } = require("../middleware/route.guard");

router.get("/signup", isLoggedOut, (req, res, next) => {
	res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.render("auth/signup", {
			errorMessage: "All fields are required",
		});
		return;
	}

	bcrypt
		.genSalt(10)
		.then((salt) => bcrypt.hash(password, salt))
		.then((hashedPassword) => {
			return User.create({ username, password: hashedPassword });
		})
		.then(() => res.redirect("/profile"))
		.catch((err) => {
			if (err instanceof mongoose.Error.ValidationError) {
				console.log(err);
				res.status(500).render("auth/signup", { errorMessage: err.message });
			} else if (err.code === 11000) {
				console.log(err);
				res.status(500).render("auth/signup", {
					errorMessage:
						"Please provide a unique username or email. The one you chose is already taken",
				});
			} else {
				next(err);
			}
		});
});

router.get("/login", (req, res, next) => res.render("auth/login"));

router.get("/profile", (req, res, next) => res.render("auth/profile"));

module.exports = router;
