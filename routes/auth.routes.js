const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

const saltRounds = 10



router.get('/registro', (req, res) => {

    res.render('auth/signup-form')
})



router.post('/registro', (req, res) => {

    const { username, userPassword, email } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(userPassword, salt))
        .then(passwordHash => {
            return User.create({ email, username, password: passwordHash })
        })
        .then(user => res.redirect('/perfil'))
        .catch(err => console.log(err))
})



router.get('/iniciar-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login-form')
})



router.post('/iniciar-sesion', (req, res) => {

    const { email, userPassword } = req.body

    if (email.length === 0 || userPassword.length === 0) {
        res.render('auth/login-form', { errorMessage: 'Rellena los datos' })
        return
    }
    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login-form', { errorMessage: 'Datos de acceso incorrectos' })
                return
            }

            else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { errorMessage: 'Datos de acceso incorrectos' })
            }

            else {
                req.session.currentUser = user
                res.redirect('profile')
            }


        })


    router.get('/cierre-sesion', (req, res) => {
        req.session.destroy(() => res.redirect('/'))
    })







})

module.exports = router
