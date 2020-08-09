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
			res.redirect("/auth/signup");
		})
		.then((userDoc) => console.log(userDoc))
		.catch((err) => console.log(err));
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
					errorMessage: "E-mail is not registered. Try again.",
				});
				return;
			} else if (bcryptjs.compareSync(password, user.passwordHash)) {
				// res.render("user-views/userProfile", { user });
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
