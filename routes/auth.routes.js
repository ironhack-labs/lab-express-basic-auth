const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')





// signup form (render)
router.get("/signup", (req, res, next) => {
    res.render("auth/signup")
})

// signup form (handling)
router.post("/signup", (req, res, next) => {

    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Los campos son obligatorios' })
        return
    }

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ email, password: hashedPassword }))
        .then(() => res.redirect('/login'))
        .catch(err => next(err))
})

// login form (render)
router.get("/login", (req, res, next) => {
    res.render("auth/login")
})
// login form (handling)
router.post("/login", (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }
    User
        .findOne({ email })
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
            res.redirect('/main')
        })
})


router.get('/desconectar', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router