const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const bcryptSalt = 10
const User = require('../models/user-model')

router.get('/signup', (req, res, next) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    if(!username || !password) {
        res.render('auth/signup', {errorMessage: '<p>Todos los campos deben estar rellenos.</p>'})
        return
    }
    User.findOne({ username })
    .then(foundUser => {
        if (foundUser) {
            res.render('auth/signup', {errorMessage: '<p>El usuario ya existe.</p>'})
            return
        }
        const salt = bcrypt.genSaltSync(bcryptSalt)
        const hashPass = bcrypt.hashSync(password, salt)

        User.create({ username, password: hashPass })
        .then(newUser => res.redirect('/'))
        .catch(err => console.log("Hubo un error!", err))
    })
    .catch(err => console.log("Hubo un error!", err))
})


router.get('/login', (req, res, next) => res.render('auth/login'))
router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    console.log(req)
    if(!username || !password) {
        res.render('auth/login', {errorMessage: '<p>Todos los campos deben estar rellenos.</p>'})
        return
    }
    User.findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render("auth/login", { errorMessage: "<p>El usuario no se encunetra en la BBDD</p>" })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render("auth/login", { errorMessage: "<p>La contraseña no coincide</p>" })
                return
            }

            req.session.currentUser = foundUser
            res.redirect("/")
    })
    .catch(err => console.log("Hubo un error!", err))
})

module.exports = router