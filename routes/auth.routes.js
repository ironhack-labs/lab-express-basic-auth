const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard');

const saltRounds = 10

//signup

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))


})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password === 0) {
        res.render('auth/login', { errorMessage: "fill the fields" })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: "ufer dof nof efifts" })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: "pafword daf nof efifts" })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')
        })
        .catch(err => next(err))

})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})






module.exports = router