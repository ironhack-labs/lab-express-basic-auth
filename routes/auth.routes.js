const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')
const saltRounds = 10

router.get('/sign-up', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})

router.post('/sign-up', (req, res) => {

    const { username, userPassword } = req.body
    console.log(req.body)
    console.log('entro aqui???')

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})

router.post('/login', (req, res) => {

    const { username, userPassword } = req.body

    if (username.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Write something please' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'User not find' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'WRONG password' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})


router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router