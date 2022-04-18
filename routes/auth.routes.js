const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const User = require('../models/User.model')
const { isLoggedOut } = require('./../middleware/route-guard')

router.get('/singup', (req, res) => {
    res.render("singup")
})

router.post('/singup', (req, res, next) => {
    const { username, email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0 || username.length === 0) {
        res.render('singup', { errorMessage: 'Rellena todos los campos' })
        return
    }
    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(plainPassword, salt))
        .then(hashedPassword => User.create({ username, email, password: hashedPassword }))
        .then(() => res.redirect('/singin'))
        .catch(error => next(error));
})

router.get('/singin', isLoggedOut, (req, res) => {
    res.render('singin')
})

router.post('/singin', (req, res, next) => {

    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('singin', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('singin', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(plainPassword, user.password)) {
                res.render('singin', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user
            res.redirect('myprofile')
        })

})

router.post('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router