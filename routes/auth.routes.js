const express = require('express')
const router = express.Router()

const User = require('./../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10


// 1. SIGNUP
router.get('/signup', (req, res, next) => res.render('auth/signup'))

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/signup', { errorMsg: 'Rellena los campos.' })
        return
    }

    if (password.length < 2) {
        res.render('auth/signup', { errorMsg: 'La contraseña es demasiado corta.' })
        return
    }


    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.create({
        username,
        password: hashPass
    })
        .then(theUserCreated => {
            console.log('Se ha creado el usuario registrado.', theUserCreated)
            res.redirect('home')
        })

        .catch(error => {
            console.log(error)
        })
})

//2. LOGIN

router.get('/login', (req, res) => {
    res.render('auth/login')
})

router.post('/login', (req, res) => {

    const { username, password } = req.body
    console.log(req.body)


    // form validation
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMsg: 'Rellena los campos' })
        return
    }

    User
        .findOne({ username })
        .then(theUser => {
            console.log(theUser)

            if (!theUser) {
                res.render('auth/login', { errorMsg: 'Usuario no reconocido' })
                return
            }

            if (bcrypt.compareSync(password, theUser.password)) {

                req.session.currentUser = theUser
                console.log('El usuario con sesión inciada es:', req.session.currentUser)
                res.redirect('/profile')

            } else {

                res.render('auth/login', { errorMsg: 'Contraseña incorrecta' })
                return
            }
        })
})


module.exports = router
