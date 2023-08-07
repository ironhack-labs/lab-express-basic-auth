const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard')
const { isLoggedIn } = require('../middlewares/route-guard');

const saltRounds = 10


// ---------- [SIGNUP FORM - RENDER] ----------

router.get('/signup', (req, res) => {

    res.render('auth/signup')
})

// ---------- [SIGNUP FORM - HANDLER] ----------

router.post('/signup', (req, res, next) => {

    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))
})

// ---------- [LOGIN FORM - RENDER] ----------

router.get('/login', (req, res) => {

    res.render('auth/login')
})

// ---------- [LOGIN FORM - HANDLER] ----------

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Please fill all the fields' })
        return
    }

    User

        .findOne({ username })

        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'User not found' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Wrong password, please try again' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/profile')

        })
        .catch(err => next(err))
})

// ---------- [USER PROFILE] ----------

router.get('/profile', (req, res) => {

    res.render('user/profile')
})

// ---------- [LOGOUT PROFILE] ----------

router.get('/logout', (req, res) => {

    req.session.destroy(() => res.redirect('/'))

})

// ---------- [EXPORT] ----------

module.exports = router