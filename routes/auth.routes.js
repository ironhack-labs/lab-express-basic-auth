const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const User = require('./../models/user.model')
const app = require('../app')


//Rutas Registro
router.get('/register', (req, res) => res.render('login/signup'))


router.post('/register', (req, res) => {

    const { username, password} = req.body


    if (username.length === 0 || password.length === 0) {
        res.render('login/signup',
        { errorMsg: 'Rellena todos los campos' })
        return
    }


    User
        .findOne({ username })
        .then(person => {
             
            if (person) {
                res.render('login/signup', { errorMsg: 'Usuario ya registrado' })
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


// Rutas Login
router.get('/login', (req, res) => res.render('login/login'))

router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('login/login',
        { errorMsg: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(person => {

            if (!person) {
                res.render('login/login', {errorMsg: 'Usuario no creado'})
                return
            }

            if (!bcrypt.compareSync( password, person.password)) {
                res.render("login/login", { errorMsg: "Contraseña incorrecta" })
                return
            }

            req.session.currentUser = person
            res.render('index', { successMsg: 'Bienvenido' + person.username })

        })
})

// Cierre sesión
router.get('/log-out', (req, res) => req.session.destroy((err) => res.redirect("/")))


module.exports = router