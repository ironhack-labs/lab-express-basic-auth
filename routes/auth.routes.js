const User = require("../models/User.model");
const router = require("express").Router();
const bcrypt = require('bcryptjs');


//-------- SIGN UP --------
// Handle GET request to /signup page
router.get('/signup', (req, res, next) => {
    res.render('auth/signup.hbs')
})

// Handle POST request to /signup page + send input to DB
router.post('/signup', (req, res, next) => {
    const {username, password} = req.body

    // check user has filled in all fields
    if (!username || !password) {
        res.render('auth/signup.hbs', {error: 'Please enter all fields'})
        return;
    }

    // check the password strength
    const passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!passRegEx.test(password)) {
        res.render('auth/signup.hbs', {error: 'Password not strong enough. Make sure your password is 6-16 characters long and includes both a special character and a number.'})
        return;
    }

    // Password encyrption time! 
    // Generate salt
    const salt = bcrypt.genSaltSync(10);
    // Uses the salt and the password to create a hashed password
    const hash = bcrypt.hashSync(password, salt);
    User.create({username, password: hash})
        .then(() => {
            // if created, redirect to sign-in page
            res.redirect('/signin')
        })
        .catch((err) => {
            next(err)
        })
})
//-------------------------

//-------- SIGN IN --------
// Handle GET request to /signin page
router.get('/signin', (req, res, next) => {
    res.render('auth/signin.hbs')
})

// Handle POST request to /signin page and enable login
router.post('/signin', (req, res, next) => {
    const {username, password} = req.body

    // check is username is in DB
    User.findOne({username})
        .then((user) => {
            if (user) {
                // if username exists, check for match against inputted password and hashed password stored in DB
                // remember password = inputted password FIRST
                // user.password = hash stored in DB SECOND
                let isValid = bcrypt.compareSync(password, user.password);
                if (isValid) {
                    req.session.loggedInUser = user
                    res.redirect('/profile')
                } else {
                    // if passwords don't match
                    res.render('auth/signin', {error: 'Invalid password'})
                }
            } else {
                // if the inputted username for not exist in the DB
                res.render('auth/signin', {error: 'Username does not exist. Please check and try again.'})
            }
        })
        .catch((error) => {
            next(error)
        })
})

//--------------------------

//-------- PROFILE ---------

// Handle GET request for profile page
router.get('/profile', (req, res, next) => {
    if (req.session.loggedInUser) {
        res.render('auth/profile.hbs')
    } 
    else {
        res.redirect('/signin')
    }
})

//--------------------------



module.exports = router;