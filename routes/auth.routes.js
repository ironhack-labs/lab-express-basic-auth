const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut, isLoggedIn } = require('../middlewares/route-guard')

// signup
router.get('/registro', (req, res, next) => {
    res.render('auth/signup')
})
// sign up
router.post('/registro', isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(hashedPassword => User.create({ username, password: hashedPassword }))
        .then(() => res.redirect('/'))
        .catch(err => next(err))
})
// //profile
router.get('/profile', (req, res, next) => {
    res.render('auth/profile')
})
// log in
router.get('/inicio-sesion', isLoggedOut, (req, res, next) => {
    res.render('auth/login')
})
// log in
router.post("/inicio-sesion", isLoggedOut, (req, res, next) => {
    const { username, password } = req.body
    // console.log({ username, password })
    if (username.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill the gaps!' })
        return
    }

    User
        .findOne({ username })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'No te has registrado melón!' })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'La contraseña melón!' })
                return
            }
            req.session.currentUser = foundUser
            res.redirect('/profile')
        })

})
module.exports = router