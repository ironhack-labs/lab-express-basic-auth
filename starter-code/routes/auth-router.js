const express = require("express");

const router = express.Router();

const bcrypt = require("bcrypt");
const flash = require('connect-flash');


const User = require("../models/user-model.js")

router.get("/signup", (req, res, next) => {
	res.render("auth-views/signup-form.hbs");
})

router.post("/process-signup", (req, res, next) => {
	const { userName, originalPassword } = req.body;

	const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

	if(!userName || userName.length <= 3) {
		req.flash("error", "user name must be at least 4 characters");
		res.redirect("/signup");
		return;
	};

	if (!originalPassword) {
		req.flash("error", "please specify a password");
		res.redirect("/signup");
		return;
	};

	User.create( { userName, encryptedPassword} )
		.then(userDoc => {
			res.redirect("/");
		})
		.catch(err => next(err));
})

router.get("/login", (req, res, next) => {
	res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
	const { userName, originalPassword } = req.body;

	User.findOne( {userName: { $eq: userName } } )
		.then(userDoc => {
			if(!userDoc) {
				req.flash("error", "Incorrect Username")
				res.redirect("/login");
				return;
			};

			const { encryptedPassword } = userDoc;
			if(!bcrypt.compareSync(originalPassword, encryptedPassword)) {
				req.flash("error", "Incorrect Password")
				res.redirect("/login");
			}
			else {
				req.flash("success", "Login successful");
				res.redirect("/");
			};
		})
		.catch(err => next(err));

})






module.exports = router;