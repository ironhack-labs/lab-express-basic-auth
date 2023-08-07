const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard');



const saltRounds = 10


// Sign Up Form (RENDER)
router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})


// Sign Up Form (HANDLER)
router.post('/register', isLoggedOut, (req, res, next) => {
    const { username, email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => User.create({ username, email, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})


// Log In Form (RENDER)
router.get('/enter', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

// Log In Form (HANDLER)
router.post('/enter', isLoggedOut, (req, res, next) => {
    console.log('Login handler reached');
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill in all the fields' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'User not found' })

            }
            else if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Incorrect password' })

            } else {
                console.log('Found user:', foundUser);
                req.session.currentUser = foundUser
                res.redirect('/my-profile')
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            next(err);
        })


})



module.exports = router