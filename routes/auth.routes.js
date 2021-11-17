// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();

const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const User = require('../models/User.model');

// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

router.get('/userProfile', (req, res) => res.render('users/user-profile'));

router.get('/login', (req, res) => res.render('auth/login'));

router.get('/main', (req, res, next) => {
    res.render('main')
})

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    // console.log("The form data: ", req.body);

    const { username, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {
            return User.create({
                // username: username
                username,
                // passwordHash => this is the key from the User model
                //     ^
                //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
                passwordHash: hashedPassword
            });
        })
        .then(userFromDB => {
            res.redirect('/userProfile');
        })
        .catch(error => next(error));
});

// middleware to protect a route
const loginCheck = () => {
    return (req, res, next) => {
        // check for a logged in user
        if (req.session.user) {
            next()
        } else {
            res.redirect('/login')
        }
    }
}

router.get('/private', loginCheck(), (req, res, next) => {
    res.render('private')
})

router.get('/profile', loginCheck(), async (req, res, next) => {
    // set a cookie if you want
    //res.cookie('theCookie', 'hello node')
    //(console.log('this is the cookie', req.cookies))
    // clear the cookie
    //res.clearCookie('theCookie')
    // retrieve logged in user from session
    const loggedInUser = req.session.user
    console.log('LOGGEDINUSER', loggedInUser)
    res.render('profile', { user: loggedInUser })
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body;

    if (username === '' || password === '') {
        res.render('auth/login', {
            errorMessage: 'Please enter both, username and password to login.'
        });
        return;
    }

    User.findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'User is not registered. Try with other user.' });
                return;
            } else if (bcryptjs.compareSync(password, user.passwordHash)) {
                res.render('users/user-profile', { user });
            } else {
                res.render('auth/login', { errorMessage: 'Incorrect password.' });
            }
        })
        .catch(error => next(error));
});

router.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err)
        } else {
            res.redirect('/')
        }
    })
})

module.exports = router;

