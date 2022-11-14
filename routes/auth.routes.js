const router = require("express").Router();

const User = require('./../models/User.model')

const bcryptjs = require('bcryptjs');
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guards');

router.get('/registro', isLoggedOut, (req, res) => {
    res.render('auth/signup')
})

router.post('/registro', isLoggedOut, (req, res) => {

    const { username, plainPassword } = req.body
    console.log({ username, plainPassword })

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(plainPassword, salt)
        })
        .then(hashedPassword => {
            return User.create({ username, password: hashedPassword })
        })
        .then(() => res.redirect('/inicio-sesion'))
        .catch(err => {
            console.log(err)
            // res.redirect('registro')
            res.render('auth/signup', { errorMessage: 'el usuario ya existe' })
        })
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
                res.render('auth/login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (bcryptjs.compareSync(plainPassword, user.password) === false) {
                res.render('auth/login', { errorMessage: 'Contraseña incorrecta' })
                return
            }
            req.session.currentUser = user
            res.redirect('/main')
        })
        .catch(err => console.log(err))
})

router.get('/cierre-sesion', (req, res) => {
    req.session.destroy(() => res.redirect('/inicio-sesion'))
})

module.exports = router;

