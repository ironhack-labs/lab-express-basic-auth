const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

router.get("/signup", isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post("signup", isLoggedOut, (req, res, next) => {
    const { username, plainPassword } = req.body
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .catch(err => next(err))
})
router.get("/login", isLoggedOut, (req, res) => {
    res.render("auth/login")
})

router.post("/login", isLoggedOut, (req, res, next) => {

    const { username, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill in all the fields' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Email not registered' })
                return
            }

            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'wrong password' })
                return
            }

            req.session.currentUser = foundUser
            console.log('logged in', req.session)
            res.redirect('/')
        })
        .catch(err => next(err))
})



module.exports = router