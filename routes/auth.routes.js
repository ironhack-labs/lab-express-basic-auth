const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

router.get("/register", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
})

router.post("/register", (req, res, next) => {

    const { username, email, plainPassword } = req.body

    if (username.length === 0 || email.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'All fields are required' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, email, password: hashedPassword }))
        .then(() => res.redirect('login'))
        .catch(err => next(err))
})

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("auth/login")
})
router.post("/login", (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'All fields are required' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'User not found' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Incorrect Password ' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/profile')
        })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router