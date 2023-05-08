const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('../middlewares/route-guard')
const User = require('./../models/User.model')

/// Crear usuario////

router.get("/registro", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
})

router.post('/registro', (req, res, next) => {
    const { userName, plainPassword } = req.body

    if (userName.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ userName, password: hashedPassword }))
        .then(res.redirect('/inicio-sesion'))
        .catch(err => next(err))
})

///// logear usuario///

router.get("/inicio-sesion", isLoggedOut, (req, res, next) => {
    res.render("auth/login")
})

router.post('/inicio-sesion', (req, res, next) => {
    const { userName, password } = req.body

    if (userName.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }
    User
        .findOne({ userName })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = foundUser
            res.redirect('/')

        })
})
/// cerrar sesion//

router.get('/desconectar', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router

