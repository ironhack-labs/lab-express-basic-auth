const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const bcryptSalt = 10

const User = require('../models/user.models')
const app = require('../app')


// Endpoints

// FORMULARIO DE REGISTRO
router.get('/registro', (req, res) => res.render('auth/signup-form.hbs'))

// GESTION DEL FORMULARIO DE REGISTRO
router.post('/registro', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup-form', { errorMsg: 'Rellena todos los campos requeridos' })
        return
    }

    if (password.length < 4) {
        res.render('auth/signup-form', { errorMsg: 'Minimo 5 caracteres para tu contraseña' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup-form', { errorMsg: 'Usuario ya registrado' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)


            User
                .create({ username, password: hashPass })
                .then(() => res.render('index', { successMsg: '¡Te has registrado con exito!' }))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


// FORMULARIO DE LOGINUP

router.get('/inicio-sesion', (req, res) => res.render('auth/loginup-form'))

// GESTION DE FORMULARIO DE LOGINUP

router.post('/inicio-sesion', (req, res, next) => {
    
    const { username, password } = req.body
    
        if (username === "" || password === "" ) {
        res.render('auth/loginup-form', { errorMsg: 'Rellena todos los campos requeridos, bien' })
        return
    }

    if (password.length < 4) {
        res.render('auth/loginup-form', { errorMsg: 'Minimo 5 caracteres para tu contraseña' })
        return
    }

    User

        .findOne({ username: username })
        .then(theUser => {

            if (!theUser) {
                res.render('auth/loginup-form', { errorMsg: 'Este que metes no esta' })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render('auth/loginup-form', {errorMsg: 'Si estas pero no sabes entrar, contraseña fallida'})
                return
            }

            req.session.currentUser = theUser
            res.render('index', {successMsg: '¡Pero si estabas aqui, bienvenido ' + theUser.username + '!'})
        })
        .catch(err => console.log(err))
})

module.exports = router
