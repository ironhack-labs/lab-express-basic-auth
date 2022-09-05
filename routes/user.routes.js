const router = require('express').Router()
const UserModel = require('../models/User.model')
const bcrypt = require('bcryptjs')


/**
 * GET
 */

router.get('/layout', (req, res) => {
    const user = req.session.user
    res.render('layout', user)
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/profile', (req, res) => {
    const user = req.session.user
    res.render('profile', user)
})

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


/**
 * POST
 */

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

    bcrypt
        .genSalt(10)
        .then((salts) => {
            return bcrypt.hash(password, salts)
        })
        .then((pass) => {
            return UserModel.create({ password: pass, username })
        })
        .then((user) => {
            res.redirect('/')
        })
        .catch((err) => {
            next(err)
        })
})

router.post('/login', (req, res, next) => {
    const { username, password } = req.body
    let user;
    if (username === '' || password === '') {
        res.render('login', {
            errorMessage: 'Por favor, introduzca su correo electrónico y su contraseña para iniciar sesión.'
        })
        return

    }
    UserModel.findOne({ username })
        .then((userDb) => {
            user = userDb
            return bcrypt.compare(password, user.password)
        })
        .then((isPassword) => {
            if (isPassword) {
                req.session.user = user
                res.redirect('/profile')
            } else {
                res.render('login', {
                    errorMessage: 'Usuario o contraseña incorrectos',
                })
            }
        })
        .catch((err) => {
            res.render('login', {
                errorMessage: 'Usuario o contraseña incorrectos',
            })
        })

})

module.exports = router