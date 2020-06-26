const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('./../models/User.model')

/* SIGN UP */
router.get('/signup', (req, res, next) => res.render('auth/signup'));
router.post('/signup', (req, res) => {
    const {
        username,
        password
    } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', {
            errorMsg: 'The fields cannot be empty!'
        })
        return
    }

    if (password.length < 3) {
        res.render('auth/signup', {
            errorMsg: 'Your password is too short!'
        })
        return
    }
    User
        .findOne({
            username
        })
        .then((foundedUser) => {
            if (foundedUser) {
                res.render('auth/signup', {
                    errorMsg: 'That name is already taken!'
                })
                return
            } else {
                const salt = bcrypt.genSaltSync(bcryptSalt)
                const hashPass = bcrypt.hashSync(password, salt)

                User.
                create({
                    username,
                    password: hashPass
                })
                res.render('auth/signup', {
                    confirmMsg: "You signed up correctly!"
                })
            }
        })
})


/* LOG IN */

router.get('/login', (req, res, next) => res.render('auth/login'));
router.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', {
            errorMsg: 'The fields cannot be empty!'
        })
        return
    }
    User
        .findOne({
            username
        })
        .then(theUser => {
            if (!theUser) {
                res.render('auth/login', {
                    errorMsg: 'There is no user with that name'
                })
                return
            }
            if (bcrypt.compareSync(password, theUser.password)) {
                req.session.currentUser = theUser
                res.redirect('/')
            } else {
                res.render('auth/login', {
                    errorMsg: 'Incorrect password'
                })
                return
            }
        })
})
module.exports = router;