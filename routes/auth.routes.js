const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')



// signup form (render)
router.get('/signup', isLoggedOut, (req, res, next) => {
    res.render('auth/signup')
})

// signup form (handler)
router.post('/signup', isLoggedOut, (req, res, next) => {
    const { email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashPassword => {
            User
                .create({ email, password: hashPassword })
        })
        .then(() => res.redirect('/'))
        .catch(err => next(err))

})

router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("auth/login")
})

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
            req.session.currentUser = foundUser
            res.redirect('/main')
        })
})

router.get('/disconnect', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router
