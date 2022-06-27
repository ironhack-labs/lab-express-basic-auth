const router = require('express').Router()
const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/session-guard')

router.get("/register", isLoggedOut, (req, res) => {
    res.render("auth/signup")
})

router.post('/register', isLoggedOut, (req, res) => {
    const { username, password: plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPass => User.create({ username, password: hashedPass }))
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {
    const { username, password: plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'campos obligatorios' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user
            res.redirect('/my-profile')
        })
        .catch(err => console.log(err))
})


module.exports = router