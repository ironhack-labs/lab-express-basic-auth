const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');

router.get('/signup', (req, res, next) => {
  res.render('signup');
});

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/signup', (req, res, next) => {
    console.log(req.body)
    const {username, password} = req.body
    // if(password.length < 8) {
    //     res.render('signup', { message: 'Your password must be at least 8 characters long'})
    //     return
    // }
    // // check if the username is empty
	// if (username.length === 0) {
	// 	// if yes show the form again with a message
	// 	res.render('signup', { message: 'Your username cannot be empty' });
	// 	return;
	// }
	// validation passed - username and password are in the correct format
	// we now check if that username already exists
	User.findOne({ username: username })
		.then(userFromDB => {
			// if user exists
			if (userFromDB !== null) {
				// we render signup again	
				res.render('signup', { message: 'This username is already taken' });
			} else {
				// if we reach this point this username can be used 
				// we hash the password and create the user in the database
				const salt = bcrypt.genSaltSync();
				const hash = bcrypt.hashSync(password, salt);
				console.log(hash);
				User.create({ username: username, password: hash })
					.then(createdUser => {
						console.log(createdUser);
						res.redirect('/');
					})
					.catch(err => {
						console.log(err);
					})
			}
		})
})

router.post('/login', (req, res, next) => {

	const { username, password } = req.body;
	User.findOne({ username: username })
		.then(userFromDB => {
			if (userFromDB === null) {
				res.render('login', { message: 'Invalid credentials' });
				return;
			}
			if (bcrypt.compareSync(password, userFromDB.password)) {
				req.session.user = userFromDB;
				res.redirect('/main');
			} else {
				res.render('login', { message: 'Invalid credentials' });
				return;
			}
		})


});

router.get('/logout', (req, res, next) =>{
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
})

module.exports = router;
