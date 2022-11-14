const express = require('express')
const router = express.Router()
const User = require('./../models/User.model')
const bcryptjs = require('bcryptjs')
const saltRounds = 10
const { isLoggedout } = require('./../middleware/route-safe')


router.get('/registrar', isLoggedout, (req, res) => {
    res.render('auth/signup')
})
router.post('/registrar', isLoggedout, (req, res) => {
    const { email, password } = req.body
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)

        })
        .then(hashedPassword => {

            return User
                .create({ email, password: hashedPassword })
        })
        .then(() => res.redirect('/iniciar-sesion'))
        .catch(err => console.log(err))
})

router.get('/iniciar-sesion', isLoggedout, (req, res) => {
    res.render('auth/login')
})

router.post('/iniciar-sesion', isLoggedout, (req, res, next) => {
    const { email, password } = req.body
    User
        .findOne({ email })
        .then(email => {
            if (!email) {
                res.render('auth/login', { errorMessage: 'Email no reconocido' })
                return
            }
            if (bcryptjs.compareSync(password, email.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = email      // login
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})
router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/iniciar-sesion'))
})












module.exports = router