const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const saltRounds = 10

const { isLoggedOut } = require('./../middleware/route-guard')


const User = require('../models/User.model')

router.get('/signup', isLoggedOut, (req, res) => {
    res.render('signup')
})

router.post('/signup', isLoggedOut, (req, res, next) => {

    const { username, password } = req.body

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => bcryptjs.hash(password, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/login'))
        .catch(error => next(error));
})

router.get('/login', isLoggedOut, (req, res) => {
    res.render('login')
})


router.post('/login', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(user => {
            if (!user) {
                res.render('login', { errorMessage: 'Usuario no reconocido' })
                return
            }

            if (!bcryptjs.compareSync(password, user.password)) {
                res.render('login', { errorMessage: 'Contraseña no válida' })
                return
            }

            req.session.currentUser = user          // <= THIS means logging in a user
            res.redirect('/private')
        })
        .catch(error => next(error));
})



module.exports = router
