const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const User = require('../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')
const saltRounds = 10

//REGISTRAME

router.get('/register', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})

router.post('/register', (req, res) => {

    const { username, userPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
})

//LOGEARME

router.get('/log-in', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})


router.post('/log-in', (req, res) => {

    const { username, userPassword } = req.body

    if (username.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Please complete all fields to Log-in' })
    }

    User

        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'User not found. Please go to register' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Username or password is not correct' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/profile')
            }
        })

})

// CERRAR SESION

router.get('/log-out', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router