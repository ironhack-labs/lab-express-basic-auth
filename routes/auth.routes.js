const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10


// Sign up
router.get('/signup', (req, res, next) => res.render('auth/signup-page'))

router.post('/signup', (req, res, next) => {
    const { username, userPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(userPassword, salt))
        .then(hashedPass => User.create({ username, password: hashedPass }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

// Log in

router.get('/login', (req, res, next) => res.render('auth/login-page'))

router.post('/login', (req, res, next) => {
    const { username, userPassword } = req.body

    if (username.length === 0 || userPassword.length === 0) {
        res.render('auth/login-page', { errMessage: 'Username/Password not filled' })
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-page', { errMessage: 'Username not registered' })
                return
            }
            else if (bcryptjs.compareSync(userPassword, user.password) === false) {
                res.render('auth/login-page', { errMessage: 'Incorrect password' })
                return
            }
            else {
                req.session.currentUser = user
                res.redirect('/main')
            }
        })
        .catch(err => console.log(err))
})

// Log out

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/login'))
})

module.exports = router