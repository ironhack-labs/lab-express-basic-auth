const express = require('express');
const router = express.Router();

const User = require('./../models/User.model')
const bcryptjs = require('bcryptjs');
const saltRounds = 10
//const { isLoggedOut } = require('../middleware/route-guard');

router.get('/registro', (req, res) => {
    res.render('auth/singup')
})

router.post('/registro', (req, res) => {
    // aqui desestructuramos con los `name` que ponemos en el FORMULARIO
    const { email, password } = req.body
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)

        })

        .then(hashedPassword => {
            return User.create({ email, password: hashedPassword })
        })
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => console.log(err))
})


router.get('/inicio-sesion', (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res) => {

    const { email, password } = req.body

    User
        .findOne({ email })
        .then(user => {

            if (!user) {
                res.render('auth/login', { errorMessage: 'Email no reconocido' })
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



module.exports = router;




