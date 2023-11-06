const router = require("express").Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedIn } = require('../middleware/route-guard')


router.get('/registro', (req, res) => {
    res.render('auth/signup')
})

router.post('/registro', (req, res, next) => {

    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => next(err))
})

router.get('/inicio-sesion', (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellenar todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Nombre de Usuario no registrado' })
                return
            }

            if (bcrypt.compareSync(password, foundUser.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña Incorrecta' })
                return
            }

            req.session.currentUser = foundUser
            res.redirect('/')
        })
        .catch(err => next(err))
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

router.get('/publica', (req, res) => {
    res.render('imagen/publica')
})

router.get('/privado', isLoggedIn, (req, res) => {
    res.render('imagen/privado')
})



module.exports = router