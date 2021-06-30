const router = require("express").Router();

const User = require("../models/User.model");

const bcrypt = require('bcrypt');

router.get("/signup", (req, res, next) => {
  res.render("signup");
});

router.get("/login", (req, res, next) => {
    res.render("login");
  });
  
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body;
    if (password.length < 5) {
		res.render('signup', { message: 'Your password must be at least 5 characters' });
		return;
	}
    if (username.length === 0) {
		res.render('signup', { message: 'Must choose username' });
		return;
	}
    User.findOne({username: username})
        .then(userDB => {
            if(userDB !== null) {
                res.render('signup', {message: 'username taken'});
                return;
            } else {
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
});

router.post('/login', (req, res, next) => {
    const {username, password} = req.body;
    // 1 check if if username exists
    User.findOne({username: username})
        .then(userFromDB => {
             // 2 if username doesn't exist, send message and show signup again
            if (userFromDB === null) {
                res.render('login', {message: "Invalid login"});
                return;
            }
             // 3 if username is correct, check the password from input to see if it matches
                    // bcrypt.cmpare evaluates to true or false
             if (bcrypt.compareSync(password, userFromDB.password)) {
                // 4 log the user in
                req.session.user = userFromDB;
                res.redirect('/profile');
            } else {
                 // 5 if not matching, send message and show signup again
                res.render('login', {message: "Invalid login"});
                return;
            }
        })
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    })
})

module.exports = router;
