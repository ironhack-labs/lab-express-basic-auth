const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { IsLoggedIn } = require('./../middleware/route-guard')

const User = require('../models/User.model')

router.get('/registro', IsLoggedIn, (req, res) => {
    res.render('auth/signup-view')
})

router.post('/registro', IsLoggedIn, (req, res, next) => {

    const { username, plainPassword } = req.body


    User
        .findOne( {username} )
        .then((user) => {
            if (user) {
                res.render('auth/signup-view', { errorMessage: 'Username en uso, prueba con otro o inicia sesión' })
                return

            } else {
                bcryptjs
                    .genSalt(saltRounds)
                    .then(salt => bcryptjs.hash(plainPassword, salt))
                    .then(hashedPassword => User.create({ username,password: hashedPassword }))
                    .then(() => res.redirect('/inicio-sesion'))
                    .catch(error => next(error));
            }
        })
        .catch(error => next(error));

})


router.get('/inicio-sesion', IsLoggedIn, (req, res) => {
    res.render('auth/login-view')
})


router.post('/inicio-sesion', IsLoggedIn, (req, res, next) => {

    const {username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login-view', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login-view', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login-view', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          
            res.redirect('/mi-perfil')
        })
        .catch(error => next(error));
})


router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router