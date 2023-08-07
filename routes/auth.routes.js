const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const User = require('../models/User.model')


const saltRounds = 10

//Sign up form(render)
router.get('/register', (req, res, next) => {
    res.render('auth/SignUp')
})

//Sign up form (handler)
router.post('/register', (req, res, next) => {
    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))


})

//Log in form (render)
router.get('/login', (req, res, next) => {
    res.render('auth/LogIn')
})

//Log in form (handler)
router.post('/login', (req, res, next) => {


    const { username, password } = req.body



    if (username.length === 0 || password.length === 0) {
        res.render('auth/LogIn', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/LogIn', { errorMessage: 'Usuario erroneo' })
                return
            }

            if (!bcrypt.compareSync(password, user.password)) {
                res.render('auth/LogIn', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = user
            res.redirect('/')
        })
        .catch(err => next(err))
})

//Close session
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router;
