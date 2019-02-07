const express = require('express');
const bcrypt = require("bcrypt");
const User = require("../models/user-model.js");

const router = express.Router();


/* GET signup page */
router.get('/signup', (req, res, next) => {
	//res.json('queryResult'); // to see it as json in browser
	res.render('auth/signup_form.hbs');
});

/* POST signup process */
router.post('/signup-process', (req, res, next) => {
	const {
		name,
		surname,
		email,
		originalPassword
	} = req.body;


	if (!originalPassword || originalPassword.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)) {
		// https://stackoverflow.com/a/21456918/3468846
		res.redirect('/signup'); // redirect to books index

		return;

	}

	// ToS checkbox to boolean
	if (req.body.terms === "on") {
		terms = true;
	}

	// encrypt submitted password
	const encryptedPassword = bcrypt.hashSync(originalPassword, 12);

	User.create({
			name,
			surname,
			email,
			encryptedPassword,
			terms
		})
		.then(() => {
			console.log("User has been added ! ");
			res.redirect('/'); // redirect to index
		})
		.catch(err => {
			console.log(err);
			res.redirect('/404'); // 404 error
		});

});


/* GET login page */
router.get('/login', (req, res, next) => {
	res.render('auth/login_form.hbs');
});

/* POST login process */
router.post('/login-process', (req, res, next) => {
	const {
		email,
		originalPassword
	} = req.body;

	User.findOne({
			email: {
				$eq: email
			}
		})
		.then(queryResult => {
			// redirect if !queryResult meaning null / undefined / false / 0 / NaN
			if (!queryResult) {
				res.redirect('/login');
				return;
			}

			// fetch encrypted password
			const {
				encryptedPassword
			} = queryResult;

			// redirect if submitted and stored pwd !matching
			if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {

				res.redirect('/login');

				return;
			}

			// else pwd:email match 
			res.redirect('/');

		})
		.catch(err => next(err));

});

module.exports = router;