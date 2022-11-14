const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')
const { isLoggedIn } = require('../middleware/route-guard')

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, (req, res) => {

    const { username, simplyPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(simplyPassword, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/login'))
        .catch(err => {
            console.log(err)
            if (err.code === 11000) {
                res.render('auth/signup', { errorMessage: 'Nombre de usuario ya registrado' })
            }
        })

})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/login', isLoggedOut, (req, res) => {

    const { username, simplyPassword } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Email no registrado con anterioridad' })
                return
            }

            if (bcryptjs.compareSync(simplyPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/myprofile')
        })
        .catch(err => console.log(err))
})

router.get('/closeSesion', (req, res) => {
    req.session.destroy(() => res.redirect('/login'))
})

router.get('/main', isLoggedIn, (req, res) => {
    res.render('user/main')
})

router.get('/private', isLoggedIn, (req, res) => {
    res.render('user/private')
})

module.exports = router