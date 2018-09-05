const express = require("express");
const bcrypt = require("bcrypt")
const User = require("../models/user-model.js");
const router = express.Router();

////////////////////////////////
// GET SIGNUP FORM
////////////////////////////////
router.get("/signup", (req, res, next) => {
	res.render("auth-views/signup-form")
})

////////////////////////////////
// POST SIGNUP PROCESS
////////////////////////////////
router.post("/process-signup", (req, res, next) => {
	// res.send(req.body)

	const { userName, originalPassword } = req.body;

	const encryptedPassword = bcrypt.hashSync( originalPassword, 10 )

	User.create( {userName, encryptedPassword } )
	.then(userDoc => {
		req.flash("success" , "successfully signed up")
		res.redirect("/")
	})
	.catch(err => next(err))
})

////////////////////////////////
// GET LOGIN FORM
////////////////////////////////
router.get("/login", (req, res, next) => {
	res.render("auth-views/login-form")
})

////////////////////////////////
// POST LOGIN PROCESS
////////////////////////////////
router.post("/process-login", function(req, res, next){
	const {userName, originalPassword} = req.body;
	
	User.findOne({ userName: { $eq:userName } })
	.then(userDoc => {
		console.log(userDoc)
		// USERNAME DOES NOT MATCH
		if (!userDoc){
			// res.send("username not in db")
			req.flash("error", "name not found in db")
			res.redirect("/signup")
			return
		}
		// PWD DOES NOT MATCH
		const { encryptedPassword } = userDoc;
		console.log(encryptedPassword)
		if (!bcrypt.compareSync(originalPassword, encryptedPassword)){
			// res.send(" pwd does not match ")
			req.flash("error", "pwd does not match our db")
			res.redirect("/login")
			return
		}
		// IT ALL GOES OK
		// res.send("cool you can go on")
		req.flash("success", "welcome back!")
		res.redirect("/secret")
	})
	.catch(err => next(err))
})

////////////////////////////////
// GET SECRET PAGE
////////////////////////////////
router.get("/secret", (req, res, next) => {
	res.render("auth-views/secret-page.hbs")
})


module.exports = router;