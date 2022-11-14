const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middleware/route-guard')

const bcryptjs = require('bcryptjs');

const saltRounds = 10


router.get('/register', (req, res) => {
    res.render('auth/signup')
})
router.post('/register', isLoggedOut, (req, res) => {

    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))
})
router.get('/login', (req, res) => {
    res.render('auth/login')
})
router.post('/login', isLoggedOut, (req, res) => {
    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'An error ocurred' })
                return
            }

            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'An error ocurred' })
                return
            }
            req.session.currentUser = user
            res.redirect('/my-profile')
        })
        .catch(err => console.log(err))
})
router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})


module.exports = router