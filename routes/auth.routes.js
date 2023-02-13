const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const saltRounds = 10

const User = require('../models/User.model')
const { isLoggedIn, isLoggedOut } = require('../middleware/route-guard')

//Sign up form render
router.get('/sign-up', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})

//Sign up form handler
router.post('/sign-up', (req, res) => {

    const { username, email, userPwd } = req.body

    if (username.length === 0 || email.length === 0 || userPwd === 0) {
        res.render('auth/signup-form', { errorMessage: 'Complete all the require fields' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPwd, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash }))
        .then(res.redirect('/'))
        .catch(err => console.log(err))
})

//Sign in form render

router.get('/sign-in', isLoggedOut, (req, res) => {
    res.render('auth/signin-form')
})

//Sign in form handler

router.post('/sign-in', (req, res) => {

    const { username, userPwd } = req.body

    if (username.length === 0 || userPwd === 0) {
        res.render('auth/signin-form', { errorMessage: 'Enter your username and password' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/signin-form', { errorMessage: 'Username is not registered' })
            } else if (!bcrypt.compareSync(userPwd, user.password)) {
                res.render('auth/signin-form', { errorMessage: 'Incorrect password. Try again' })
            } else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

//Sign out

router.get('/sign-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router