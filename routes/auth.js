const router = require("express").Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const { route } = require(".");

router.get('/signup', (req, res, next) => {
    res.render('signup');
});

router.get('/login', (req, res, next) => {
    res.render('login');
})

router.post('/signup', (req, res, next) => {
    console.log(req.body);
    const { username, password } = req.body;
    if (password.length < 8) {
        res.render('signup', { message: 'Your password has to be 8 chars min' });
        return;
    }
    if (username.length === 0) {
        res.render('signup', { message: 'Your username cannot be empty' });
        return;
    }
    User.findOne({ username: username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render('signup', { message: 'This username is already taken' });    
            } else {
                const salt = bcrypt.genSaltSync();
                const hash = bcrypt.hashSync(password, salt);
                console.log(hash);
                User.create({ username: username, password: hash })
                    .then(createdUser => {
                        res.redirect('/login');
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
				res.redirect('/profile');
			} else {
				res.render('login', { message: 'Invalid credentials' });
				return;
			}
		})
});

router.get('/logout', (req, res, next) => {
	// this logs the user out	
	req.session.destroy(err => {
		if (err) {
			next(err);
		} else {
			res.redirect('/');
		}
	})
});

module.exports = router;