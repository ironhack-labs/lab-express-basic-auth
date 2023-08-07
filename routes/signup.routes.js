const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const { isLoggedOut } = require('../middlewares/route-guard');

const saltRounds = 10

//Signup
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})


router.post('/signup', isLoggedOut, (req, res, next) => {

    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/auth/start-session'))
        .catch(err => next(err))
})

//login
router.get('/start-session', isLoggedOut, (req, res) => {
    res.render('auth/login')
})


router.post('/start-session', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'The fields can\'t be empty' })
        return
    }
    User
        .findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'User not valid' })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Password not valid' })
                return
            }
            req.session.currentUser = foundUser
            res.redirect('/')
        })
        .catch(err => next(err))
})

router.get('/close-session', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router