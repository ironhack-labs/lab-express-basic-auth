const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')
const isLoggedIn = require('../middleware/route.guard')


router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))

})

router.get('/login', (req, res, next) => {
    res.render('auth/login')
})

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no registrado' })
                return
            }

            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'La contraseña es incorrecta' })
                return
            }

            req.session.currentUser = foundUser
            console.log("SESIÓN INICIADA ->", req.session)
            res.redirect('/')
        })
        .catch(err => next(err))
})


module.exports = router