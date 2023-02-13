const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})

router.post('/signup', (req, res) => {
    const { username, email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0 || username.length === 0) {
        res.render('auth/signup-form', { errorMessage: 'Fill all fields, please' })
        return
    }

    const promises = [User.findOne({ username }), User.findOne({ email })]

    Promise
        .all(promises)
        .then(([username, email]) => {
            if (username) {
                res.render('auth/signup-form', { errorMessage: 'Username already taken' })
            } else if (email) {
                res.render('auth/signup-form', { errorMessage: 'Your email already has an account' })
            } else if (!username && !email) {
                return
            }
        })

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})

router.post('/login', (req, res) => {

    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Fill all fields, please' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'User not registered' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Wrong password' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router

