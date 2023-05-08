const router = require('express').Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')

router.get("/auth/sign-up", isLoggedOut, (req, res, next) => {
    res.render("auth/sign-up")
})

router.post('/register', (req, res, next) => {

    const { email, plainPassword } = req.body

    if (email.length === 0 || plainPassword.length === 0) {
        res.render('auth/sign-up', { errorMessage: '[you must provide the words]' })
        return
    }
    User
        .findOne({ email })
        .then(foundUser => {

            if (foundUser) {
                res.render('auth/sign-up', { errorMessage: "[you're already a member]" })
                return
            } else {
                bcrypt
                    .genSalt(saltRounds)
                    .then(salt => bcrypt.hash(plainPassword, salt))
                    .then(hashedPassword => User.create({ username, email, password: hashedPassword }))
                    .then(() => res.redirect('inicio-sesion'))
                    .catch(err => next(err))
            }
        })
})

router.get("/sign-in", isLoggedOut, (req, res, next) => {
    res.render("auth/sign-in")
})

router.post('/enter', (req, res, next) => {

    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/sign-in', { errorMessage: '[you must provide the words]' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/sign-in', { errorMessage: '[warning: no strangers allowed]' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/sign-in', { errorMessage: '[try again. or not.]' })
                return
            }

            req.session.currentUser = foundUser // login!
            res.redirect('/private/welcome')
        })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router;
