const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../models/user.model')
const bcryptSalt = 10

router.get('/register', (req, res) => res.render('signup-form'))
router.post('/register', (req, res) => {
    const {
        username,
        password
    } = req.body
    if (password.length < 5) {
        res.render('signup-form', {
            errorMessage: 'La contraseña debe tener más de 5 caracteres'
        })
        return
    }
    User.findOne({
            username
        })
        .then(foundUser => {
            if (foundUser) {
                res.render('signup-form', {
                    errorMessage: 'Usuario ya registrado'
                })
                return
            }
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
            User.create({
                    username,
                    password: hashPass
                })
                .then(() => res.redirect('/'))
                .catch(err => console.log(err))
        })
        .catch(err => console.log('error:', err))
})
router.get('/log-in', (req, res) => res.render('login-form'))
router.post('/log-in', (req, res) => {
    const {
        username,
        password
    } = req.body

    if (username === "" || password === '') {
        res.render('login-form', {
            errorMessage: 'Rellena los campos'
        })
        return
    }
    User.findOne({
            username
        })
        .then(foundUser => {
            if (!foundUser) {
                res.render('login-form', {
                    errorMessage: 'Usuario no registrado'
                })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password)) {
                req.session.currentUser = foundUser
                res.redirect('/')
            } else {
                res.render('login-form', {
                    errorMessage: 'Contraseña Incorrecta'
                })
            }
        })
        .catch(err => console.log(err))
})
router.get('/sign-out', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})
module.exports = router