const router = require("express").Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10

// SIGN UP
router.get("/signup", isLoggedOut, (req, res) => {
    res.render("auth/signup-form")
})

router.post('/signup', (req, res) => {

    const { username, email, userPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(password => User.create({ email, username, password }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

// LOG IN
router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})

router.post('/login', (req, res) => {

    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Campos sin rellenar' })
        return
    }
    else if (userPassword.length < 4) {
        res.render('auth/login-form', { errorMessage: 'Contraseña demasiado corta' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Usuario no registrado' })
            }
            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Contraseña incorrecta' })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
})

//LOG OUT
router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router
