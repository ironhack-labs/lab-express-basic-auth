const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const User = require('./../models/User.model')

const { isLoggedOut } = require('./../middlewares/route-guards')


router.get('/sign-up', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})

router.post('/sign-up', isLoggedOut, (req, res, next) => {
    const { username, userPassword } = req.body

    if (username.length === 0 || userPassword.length === 0) {
        res.render('auth/signup-form', { errorMessage: 'Please fill in the fields' })
    }

    // User
    //     .findOne({ username })
    //     .then(() => {
    //         if (username) res.render('auth/signup-form', { errorMessage: 'That username is already in use' })
    //     })

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => res.render('auth/signup-form', { errorMessage: 'That username is already in use' }))

})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})

router.post('/login', isLoggedOut, (req, res) => {
    const { username, userPassword } = req.body

    if (username.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Please fill in the fields' })
    }
    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'User isnt register' })
            } else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Wrong password' })
            } else {
                req.session.currentUser = user
                console.log('Estoy logeado')
                res.redirect('/')
            }

        })
})


router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router