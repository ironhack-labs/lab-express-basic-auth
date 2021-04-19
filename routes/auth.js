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

	if (!username || !password) {
		res.render("signup", { errorMessage: "Username & password is mandatory" });
	}

	User.findOne({ username })
		.then((user) => {
			if (user) {
				res.render("signup", { errorMessage: "User already exists in DB" });
			}
		})
		.catch((error) => next(error));

	const salt = bcrypt.genSaltSync(saltRound);
	const hashPassword = bcrypt.hashSync(password, salt);

	User.create({ username, password: hashPassword })
		.then(() => {
			res.render("index");
		})
		.catch((error) => next(error));
});

router.get("/login", (req, res)=> {
	res.render("login");
})

router.post("/login",(req, res) =>{
	const {username, password} = req.body;
	if (!username || !password) {
		res.render("login", { errorMessage: "Username & password is mandatory" });
	}
	User.findOne({username})
	.then((user) => {
		if (!user){
			res.render("login",{ errorMessage: "Incorrect Username or Password"});
		}

		const passwordCorrect = bcrypt.compareSync(password, user.password);
		if(passwordCorrect){
		  // Save the user in the property currentUser of session object
		  req.session.currentUser = user;
		  res.redirect('/private/profile')
		} else {
		  res.render('login', { errorMessage: "Incorrect Username or Password"});
		}
	})
})

module.exports = router;
