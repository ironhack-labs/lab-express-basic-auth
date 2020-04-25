// const express = require('express');
// const router = new express.Router();
// const requireAuth = require("../middleware/requireAuth");
// const protectedRoute = require("../middleware/requireAdmin");

// // User model
// const User = require('../models/user');

// // BCrypt to encrypt passwords
// const bcrypt = require('bcrypt');
// const bcryptSalt = 10;

// router.get('/login', (req, res, next) => {
// 	res.render('auth/login');
// });

// router.post('/login', (req, res, next) => {
// 	const theUsername = req.body.username;
// 	const thePassword = req.body.password;

// 	if (theUsername === '' || thePassword === '') {
// 		res.render('auth/login', {
// 			errorMessage: 'Please enter both, username and password to sign up.'
// 		});
// 		return;
// 	}

// 	User.findOne({ username: theUsername })
// 		.then((user) => {
// 			if (!user) {
// 				res.render('auth/login', {
// 					errorMessage: "The username doesn't exist."
// 				});
// 				return;
// 			}
// 			if (bcrypt.compareSync(thePassword, user.password)) {
// 				// Save the login in the session!
// 				req.session.currentUser = user;
// 				res.redirect('/');
// 			} else {
// 				res.render('auth/login', {
// 					errorMessage: 'Incorrect password'
// 				});
// 			}
// 		})
// 		.catch((error) => {
// 			next(error);
// 		});
// });

// // LOGOUT
// router.get("/logout", (req, res) => {
//     req.session.destroy((err) => {
//       res.redirect("/");
//     });
//   });

// module.exports = router;