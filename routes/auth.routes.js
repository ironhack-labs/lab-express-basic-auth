const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt')

const User = require('./../models/user.model')

// Endpoints

// user registration
router.get('/register', (req, res) => res.render('register'))
router.post('/register', (req, res) => {

    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (username.length === 0 || password.length === 0) {
                res.render('auth/signup-form', { errorMsg: 'Rellena los campos' })
                return
            }

            if (user) {
                res.render('auth/signup-form', { errorMsg: 'Usuario ya registrado' })
                return
            }

            if (password.length <= 1) {
                res.render('auth/signup-form', { errorMsg: 'Contraseña débil' })
                return
            }

            const bcryptSalt = 10
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.redirect('/'))
        })
        .catch(err => console.log(err))
})

// user authentication
router.get('/login', (req, res) => res.render('login'))
router.post('/login', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('login', { errorMsg: 'No seas perezoso, Teo!' })
        return
    }


    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('login', { errorMsg: 'No te inventes, Teo!' })
                return
            }

            if (!bcrypt.compareSync(password, user.password)) {
                res.render('login', { errorMsg: 'A dónde crees que vas, Teo?' })
                return
            }
            console.log(req.session)
            req.session.currentUser = user
            console.log('ESTE ES EL OBJETO DE SESIÓN CREADO', req.session)
            res.redirect('/profile')

        })
        .catch(err => console.log(err))
})

// user sign out
router.get('/sign-out', (req, res) => {
    req.session.destroy((err) => res.redirect('/'))
})

module.exports = router