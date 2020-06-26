const express = require('express')
const router = express.Router()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require('../models/user.model')

// Endpoints

// Signup
router.get('/signup', (req, res) => {
    res.render('User/signup')
})

router.post('/signup', (req, res) => {

    const { username, password } = req.body

    // form validation
    if (username.length === 0 || password.length === 0) {
        res.render('User/signup', { errorMsg: 'Rellena los campos' })
        return
    }

    if (password.length < 6) {
        res.render('User/signup', { errorMsg: 'La contraseña es corta' })
        return
    }

    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User
        .create({ username, password: hashPass })
        .then(theUserCreated => {
            console.log('Se ha creado el usuario registrado', theUserCreated)
            res.redirect('/')
        })
        .catch(err => console.log("Error", err))
})

// Login
router.get('/login', (req, res) => {
    res.render('User/login')
})


router.post('/login', (req, res) => {

    const { username, password } = req.body

    // form validation
    if (username.length === 0 || password.length === 0) {
        res.render('User/login', { errorMsg: 'Rellena los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {

            if (!theUser) {
                res.render('User/login', { errorMsg: 'Usuario no reconocido' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('El usuario con sesión inciada es:', req.session.currentUser)
                res.redirect('/')

            } else {

                res.render('User/login', { errorMsg: 'Contraseña incorrecta, merluzo' })
                return
            }
        })
        .catch(error => {
            next(error);
          })
})



// Logout
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect("/login"))
})

module.exports = router