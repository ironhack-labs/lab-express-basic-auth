const express = require('express')
const router = express.Router()

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const User = require('./../models/user.model')
const app = require('../app')

router.get('/registro', (req, res) => res.render('auth/signup-form'))



router.post('/registro', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup-form', { errorMsg: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username: username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup-form', { errorMsg: 'Usuario ya registrado' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User
                .create({ username, password: hashPass })
                .then(() => res.render('index', { successMsg: 'Registro completado' }))
                .catch(err => console.log(err))

        })
})




router.get('/iniciar-sesion', (req, res) => res.render('auth/login-form'))

router.post('/iniciar-sesion', (req, res, next) => {

    const { username, password } = req.body


    User
        .findOne({ username: username })
        .then(theUser => {
            console.log(req.user)

            if (!theUser) {
                res.render("auth/login-form", { errorMsg: "Usuario no reconocido" })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render("auth/login-form", { errorMsg: "Contraseña incorrecta" })
                return
            }

            req.session.currentUser = theUser            // inicio de sesión
            res.render('index', { successMsg: '¡Bienvenid@,' + theUser.username + '!' })
        })
        .catch(err => console.log(err))
})


module.exports = router