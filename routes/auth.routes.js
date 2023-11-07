const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { isLoggedOut } = require('../middleware/route-guard')
const saltRounds = 10

router.get("/registro", isLoggedOut, (req, res) => {
    res.render("auth/singup")
})

router.post("/registro", isLoggedOut, (req, res, next) => {
    const { username, plainPassword } = req.body
    console.log("klw: " + username)
    console.log("klw: " + plainPassword)


    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => next(err))


})


router.get("/inicio-sesion", (req, res) => {
    res.render("auth/login")

})

router.post("/inicio-sesion", (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Email no registrado' })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'contraseña incorrecta' })
                return
            }
            req.session.currentUser = foundUser
            console.log('sesión iniciada', req.session)
            res.redirect('/')
        })
        .catch(err => next(err))
})


module.exports = router