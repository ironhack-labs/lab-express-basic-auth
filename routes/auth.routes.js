const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

// signup form (render)
router.get("/registro", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
})

// signup form (handling)
router.post("/registro", (req, res, next) => {

    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('inicio-sesion'))
        .catch(err => next(err))
})

// login form (render)
router.get("/inicio-sesion", isLoggedOut, (req, res, next) => {
    res.render("auth/login")
})

// login form (handling)
router.post("/inicio-sesion", (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser // login!
            res.redirect('/')
        })
})

router.get('/desconectar', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router