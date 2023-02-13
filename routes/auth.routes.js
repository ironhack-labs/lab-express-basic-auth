const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut, isLoggedIn } = require('../middlewares/route-guard')

const saltRounds = 10

router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/signup-form')
})


router.post('/registro', (req, res) => {

    const { username, email, userPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => User.create({ email, username, password: passwordHash }))
        .then(user => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})

router.post('/inicio-sesion', (req, res) => {

    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Complete fields' })
        return
    }

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Unregistered user' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Wrong data' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main')
})
router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
})

module.exports = router