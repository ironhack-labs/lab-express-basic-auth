// 5 rutas: 2 para sig in, 2 para login, una para logout
const router = require("express").Router();

const bcrypt = require('bcryptjs');
const User = require('../models/User.model');

const saltRounds = 10

//SIG IN
router.get('/register', (req, res) => {

    res.render('user/user-signup')

})

router.post('/register', (req, res, next) => {

    const { username, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(hash => User.create({ username, password: hash }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})

//LOG IN
router.get('/login', (rez, res) => {
    res.render('user/user-login')
})


router.post('/login', (req, res, next) => {

    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render('user/user-login', { errorMessage: 'Rellena todos los campos' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('user/user-login', { errorMessage: 'Usuari@ no reconocido' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('user/user-login', { errorMessage: 'Contraseña incorrecta' })
                return
            }

            req.session.currentUser = foundUser // login!
            res.redirect('/user/user-profile')
        })
        .catch(err => next(err))

    router.get('/logout', (req, res) => {
        req.session.destroy(() => res.redirect('/'))
    })
})

module.exports = router