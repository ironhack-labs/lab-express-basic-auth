const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')


router.get('/registro', (req, res, next) => {
    res.render("auth/signup")
})


router.post('/registro', (req, res, next) => {

    const { email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ email, password: hashedPassword }))
        .then(() => res.redirect('inicio-sesion'))
        .catch(err => next(err))
    //then(res.send(req.body))
})


router.get('/inicio-sesion', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})


router.post("/inicio-sesion", (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Los campos son obligatorios' })
        return
    }


    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuario no encontrado' })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorreca' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/perfil')
        })

})


router.get('/desconectar', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router;


