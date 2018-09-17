const express = require("express");
const authRoutes = express.Router();

// User model
const User           = require("../models/user");

// BCrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
	const username = req.body.username;
	const password = req.body.password;
	const salt     = bcrypt.genSaltSync(bcryptSalt);
	const hashPass = bcrypt.hashSync(password, salt);
  
	const newUser  = User({
	  username,
	  password: hashPass
	});
  
	newUser.save()
	.then(user => {
	  res.redirect("/");
	})
  });



module.exports = authRoutes;