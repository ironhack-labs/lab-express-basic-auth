const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')


// Signup form (render)
router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})


// Signup form (handle)
router.post('/signup', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(plainPassword, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/login'))
        .catch(err => res.render('auth/signup', { errorMessage: 'Username alredy taken' }))
})


// Login form (render)
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})


// Login form (handle)
router.post('/login', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Wrong Email' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Wrong Password' })
                return
            }
            req.session.currentUser = user      // login
            res.redirect('/main')
        })
        .catch(err => console.log(err))
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})


module.exports = router