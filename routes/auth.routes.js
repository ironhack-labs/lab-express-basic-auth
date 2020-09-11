const express = require('express')
const router = express.Router()

const User = require('../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints
router.get('/register', (req, res) => res.render('sign-up'))

router.post('/register', (req, res) => {

    const { username, password } = req.body

    if (username === '' || password === '') {

        res.render('sign-up', { errorMessage: 'Rellene todos los campos por favor' })

        return
    }

    User.findOne({ username })
        .then(matchedUser => {

            if (matchedUser) { // Si ya existe un usuario con este username, expulsamos
                res.render('sign-up', { errorMessage: 'Usuario ya registrado' })
                return
            }

            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            User.create({ username, password: hashPass })
                .then(() => res.redirect('/login'))
                .catch(err => console.log(err))

        })
        .catch(error => console.log('ERROR: ', error))

})

router.get('/login', (req, res) => res.render('login'))

router.post('/login', (req, res) => {

    const { username, password } = req.body

    if (username === '' || password === '') {

        res.render('login', { errorMessage: 'Rellene todos los campos por favor' })

        return
    }

    User.findOne({ username })
        .then(matchedUser => {

            if (!matchedUser) { // Si no existe un usuario con este username, expulsamos
                res.render('login', { errorMessage: 'Este usuario no está registrado' })
                return
            }

            if (bcrypt.compareSync(password, matchedUser.password)) {
                console.log('Que pasaaaaaaa')
                req.session.currentUser = matchedUser
                res.render('index')
            } else {

                res.render('login', { errorMesage: 'Contraseña incorrecta' })

            }

        })
        .catch(error => console.log('ERROR: ', error))

})

router.get('/logout', (req, res) => req.session.destroy(() => res.redirect('login')))


module.exports = router