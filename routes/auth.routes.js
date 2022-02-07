const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10

// Signup
router.get('/signup', (req, res, next) => {
    res.render("auth/signup-form")
})

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => {

            User
                .create({ username, password: hashedPassword })
        })
        .then(createdUser => res.redirect('/'))
        .catch(error => next(error))
})

// Login
router.get('/login', (req, res, next) => {
    res.render("auth/login-form")
})

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Please, fill in every field' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Username not registered in our Database' })
                return
            } else if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login-form', { errorMessage: 'Wrong password. Please, try again' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/profile')
            }
        })
})

module.exports = router
