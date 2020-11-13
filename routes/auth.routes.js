const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const bcryptSalt = 10


const User = require('./../models/user.model')
const app = require('../app')
const { response } = require('../app')

//SIGN UP
router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/registro', (req, res) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMsg: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username: username })
        .then(theUser => {
            if (theUser) {
                res.render('auth/signup', { errorMsg: 'Usuario ya registrado' })
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


//LOG IN

router.get('/login', (req, res) => res.render('auth/login'))


router.post('/iniciar-sesion', (req, res, next) => {

    const { username, password } = req.body

    if (username === "" || password === "") {
        res.render("auth/login", { errorMsg: "Rellena todos los campos, bacalao" })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {

            if (!theUser) {
                res.render("auth/login", { errorMsg: "Usuario no reconocido" })
                return
            }

            if (!bcrypt.compareSync(password, theUser.password)) {
                res.render("auth/login", { errorMsg: "Nombre y/o contraseña incorrectos" })
                return
            }

            req.session.currentUser = theUser
            res.render('index', { successMsg: '¡Bienvenid@, ' + theUser.username + '!' })
        })
        .catch(err => console.log(err))
})


router.get('/cerrar-sesion', (req, res) => req.session.destroy((err) => res.redirect("/")))

module.exports = router