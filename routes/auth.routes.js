const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const { isLoggedIn } = require('../middlewares/route-guard');

const saltRounds = 10

//SIGNUP RENDER
router.get('/registro', (req, res) => {
    // res.send("holaaaaa")
    res.render('auth/signup')
})

//SIGNUP HANDLER
router.post('/registro', (req, res, next) => {
    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => next(err))
})

//LOGIN RENDER
router.get('/inicio-sesion', (req, res) => {
    // res.send("holaaaaaa")
    res.render('auth/login')
})
//LOGIN HANDLER
router.post('/inicio-sesion', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Faltan campos por rellenar' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Usuari@ no reconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            //login correcto
            req.session.currentUser = foundUser
            res.redirect('/main')
        })
        .catch(err => next(err))
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

router.get('/main', isLoggedIn, (req, res, next) => {
    res.render('main')
})

router.get('/private', isLoggedIn, (req, res, next) => {
    res.render('private')
})



module.exports = router