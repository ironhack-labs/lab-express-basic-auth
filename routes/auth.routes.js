const express = require('express');
const router = express.Router();

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard');
const { isLoggedIn } = require('./../middleware/route-guard')


// Signup GET, review if we are log-out to render

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})


// Signup POST

router.post('/signup', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {

            if (username === "" || plainPassword === "") {
                res.render('auth/signup', { errorMessage: 'Please, fill in the fields' })
                return
            }

            if (username) {
                res.render('auth/signup', { errorMessage: 'This username is not available' })
                return
            }

            return bcryptjs.hash(plainPassword, salt)
        })
        .then(hashedPassword => {

            return User.create({ username, password: hashedPassword })

        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))

})


// Login GET
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

// Login POST
router.post('/login', (req, res) => {

    const { username, plainPassword } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Incorrect username or password' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Incorrect password' })
                return
            }

            req.session.currentUser = user

            res.redirect('/private')
        })
        .catch(err => console.log(err))
})


router.get('/logout', isLoggedIn, (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})


module.exports = router;