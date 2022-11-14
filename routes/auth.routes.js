const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard');


router.get('/registro', (req, res, next) => {
    res.render('auth/signup')
})

router.post('/registro', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/'))
        .catch(err => console.log('esto esta fallando', err))

})


router.get('/iniciar-sesion', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})

router.post('/iniciar-sesion', isLoggedOut, (req, res, next) => {

    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcryptjs.compareSync(password, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/mi-perfil')
        })
        .catch(err => console.log(err))
})

router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/iniciar-sesion'))
})









module.exports = router;