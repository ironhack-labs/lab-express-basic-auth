const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')
const { isLoggedIn } = require('./../middleware/route-guard')

const User = require('../models/User.model')

router.get('/registro', isLoggedOut, (req, res) => {

    res.render('auth/signup')
})

router.post('/registro', isLoggedOut, (req, res, next) => {

    const { username, plainPassword } = req.body

    //////////
    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/signup', { errorMessage: 'Rellena todos los campos' })
        return
    }
    User
        .findOne({ username })
        .then(user => {

            if (user.username === username) { }
            res.render('auth/login', { errorMessage: 'Usuario ya registrado' })

        })




    ///////////
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/inicio-sesion'))
        //res.send(req.body)

        .catch(error => next(error));
})

router.get('/inicio-sesion', isLoggedOut, (req, res) => {
    res.render('auth/login')
})

router.post('/inicio-sesion', (req, res, next) => {

    const { username, plainPassword } = req.body

    if (username.length === 0 || plainPassword.length === 0) {
        res.render('auth/login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            else if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('auth/login', { errorMessage: 'Contraseña no válida' })
                return

            } else {
                req.session.currentUser = user          // <= THIS means logging in a user
                // res.send(req.session.currentUser)
                res.render('user/profile', user)
                //res.send (user)
            }
        })
        .catch(error => next(error));
})

router.post('/cerrar-sesion', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})









module.exports = router