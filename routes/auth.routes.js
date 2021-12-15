const router = require('express').Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard');

// Signup
router.get("/signup", (req, res) => res.render("auth/signup"));

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.render('auth/signup', {
            errorMessage:
              "All fields are mandatory! Please provide your username, email and password."
        });
        return;
    };

    User.findOne({ username })
        .then(user => {
            if (!user) {
              const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}/;
              if (!regex.test(password)) {
                res.status(500).render("auth/signup", {
                  errorMessage:
                    "Password must be at least 4 characters and contain at least one number, one lowercase and one uppercase letter.",
                });
                return;
              }
            }
        });

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({ username, passwordHash: hashedPassword });
        })
        .then(() => res.redirect('/userProfile'))
        .catch(err => {
            if (err.code === 11000) {
                res
                    .status(500)
                    .render('auth/signup', {
                        errorMessage:
                          'Username not available. Please try a different one.'
                    });
            } else {
                next(err);
            }
        });
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === "" || password === "") {
        res.render('auth/login', {
            errorMessage:
              "Please enter both, username and password to login."
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', {
                    errorMessage:
                      "Username not registered. Try again with a different username."
                });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                req.session.currentUser = user;
                res.redirect('/userProfile');
            } else {
                res.render('auth/login', {
                    errorMessage:
                      "Incorrect password."
                });
                return;
            }
        })
        .catch(err => next(err));
});

router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        res.redirect('/');
    })
});

// User profile
router.get('/userProfile', isLoggedIn, (req, res) => 
    res.render('users/user-profile', { userInSession: req.session.currentUser })
);

router.get("/main", isLoggedIn, (req, res) =>
  res.render("users/user-main", { userInSession: req.session.currentUser })
);

router.get("/private", isLoggedIn, (req, res) =>
  res.render("users/user-private", { userInSession: req.session.currentUser })
);

module.exports = router;