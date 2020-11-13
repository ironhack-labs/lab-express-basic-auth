
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const bcryptSalt = 10

const User = require('./../models/user.model')
const app = require('../app')

// Endpoints

router.get('/sign-up', (req, res) => res.render('auth/signup-form'))

//Iteration 1
router.post('/sign-up', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup-form', { errorMsg: 'Fill all the fields' })
        return
    }

    if (password.length < 6) {
        res.render('auth/signup-form', { errorMsg: 'Password is too short' })
        return
    }

    User
        .findOne({ username: username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup-form', { errorMsg: 'User already registered' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render('index', { successMsg: 'Regigistration done' }))
                .catch(err => console.log(err))
        })
})

//Iteration 2

router.get('/log-in', (req, res) => res.render('auth/login-form'))


router.post('/log-in', (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/login-form", { errorMsg: "Fill all the fields" })
        return
    }

    User
        .findOne({ username: username })
        .then(theUser => {

            if (!theUser) {
                res.render("auth/login-form", { errorMsg: "User unknown" })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render("auth/login-form", { errorMsg: "Incorrect Password" })
                return
            }

            req.session.currentUser = theUser
            res.render('index', { successMsg: 'Welcome,' + theUser.username + '!' })
        })
        .catch(err => console.log(err))
})


router.get('/close-session', (req, res) => req.session.destroy((err) => res.redirect("/")))


module.exports = router