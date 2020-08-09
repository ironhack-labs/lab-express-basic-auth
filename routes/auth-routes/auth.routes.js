const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../../models/User.model");

router.get("/signup", (req, res, next) => {
	res.render("auth-views/signup");
});

router.post("/signup", (req, res, next) => {
	const { username, password } = req.body;

	if (!username || !password) {
		res.render("auth-views/signup", {
			errorMessage: "All fields are mandatory.",
		});
	}

	bcryptjs
		.genSalt(saltRounds)
		.then((salt) => bcryptjs.hash(password, salt))
		.then((hashedPassword) => {
			console.log(hashedPassword);

		 	User.create({
				username,
				passwordHash: hashedPassword,
			});
			res.redirect('/auth/signup');
		})
		.then((userDoc) => console.log(userDoc))
		.catch((err) => console.log(err));
});

router.get('/login', (req,res,next) => {
	res.render('auth-views/login')
})

module.exports = router;
