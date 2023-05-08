const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')


// Signup form (render)
router.get("/register", (req, res, next) => {
    res.render("auth/sign-up")
});

// Signup form (handling)
router.post("/register", (req, res, next) => {
    const { username, plainPassword } = req.body
    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/sign-up', { errMessage: '***fields are required***' })
    }
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPass => User.create({ username, password: hashedPass }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
});

// Login form (render)
router.get('/login', (req, res, next) => {
    res.render("auth/log-in")
})

// Login form (handling)
router.post('/login', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password === 0) {
        res.render("auth/log-in", { errMessage: '***fields are required***' })
        return
    }
    User
        .findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render("auth/log-in", { errMessage: '***the user doesn´t exists***' })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render("auth/log-in", { errMessage: '***incorrect password***' })
                return
            }
            req.session.currentUser = foundUser
            res.redirect('/profile')
        })
        .catch(err => console.log(err))
})

// Logout
router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;