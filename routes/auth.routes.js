const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const { isLoggedIn } = require('../middleware/route.guard')

const saltRounds = 10

const User = require('./../models/User.model')

router.get('/main',isLoggedIn, (req, res) => {
    //res.send('Hello World')
    res.render('./main')
})

router.get('/private', isLoggedIn, (req, res) => {
    //res.send('Hello World')
    res.render('./private')
})

router.get('/registro', (req, res) => {
    //res.send('Im alive')
    res.render('./auth/signup')
})

router.post('/registro', (req, res, next) => {

    const { username, email, plainPassword } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, email, password: hashedPassword }))
        .then(() => res.redirect('/inicio-sesion'))
        .catch(error => next(error));
})

router.get('/inicio-sesion', (req, res) => {
    //res.send('Hello World')
    res.render('./auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {
    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('./auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('./auth/login', { errorMessage: 'Usuario no encontrado' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('./auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = user
            res.redirect('/main') // no funciona
        })
        .catch(err => next(err))
})


router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})
module.exports = router