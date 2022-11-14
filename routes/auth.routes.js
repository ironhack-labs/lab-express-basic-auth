const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard');


//Renderizar formulario signup
router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

//Enviar formulario signup
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

//Renderizar formulario login

router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

//Enviar formulario login

router.post('/inicio-sesion', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body

    User
        .findOne({ username })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'El username no me mola' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Esa contraseña no me gusta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/main')
        })
        .catch(err => console.log(err))
})

//Cerrar sesión

router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})


module.exports = router