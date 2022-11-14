const express = require('express')
const router = express.Router()

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')

const { isLoggedOut } = require('../middleware/route-guard')

router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/registro', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(plainPassword, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => console.log(err))
})


router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Y tú quién eres?' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/mi-perfil')

        })
        .catch(err => console.log(err))
})


router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})



module.exports = router