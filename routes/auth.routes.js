const router = require("express").Router()
const bcryptjs = require('bcryptjs')

const User = require('./../models/User.model')
const saltRounds = 10


// Sing up form
// GET

router.get('/registro', (req, res, next) => {
    res.render('auth/sing-up')
})

// POST

router.post('/registro', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('auth/sing-up', { errMsg: 'Tienes que rellenar los campos' })
        return
    }

    User
        .findOne()
        .then(user => {
            if (user) {
                res.render('auth/sing-up', { errMsg: 'El nombre de usuario ya está registrado' })
                return
            } else {
                bcryptjs
                    .genSalt(saltRounds)
                    .then(salt => bcryptjs.hash(password, salt))
                    .then(hashedPassword => {
                        return User.create({ username, password: hashedPassword })
                    })
                    .then(createdUser => res.render('user/user-profile'))
                    .catch(err => next(err))
            }
        })
})

// Log in form

// GET

router.get('/inicio-sesion', (req, res, next) => {
    res.render('auth/log-in')
})

// POST

router.post('/inicio-sesion', (req, res, next) => {

    const { username, password } = req.body

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/log-in', { errMsg: 'Nombre de usuario no registrado' })
                return
            } else if (!bcryptjs.compareSync(password, user.password)) {
                res.render('auth/log-in', { errMsg: 'Contraseña incorrecta' })
                return
            } else {
                req.session.currentUser = user
                res.redirect('/perfil')
            }
        })
})

router.get('/cerrar-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})




module.exports = router;
