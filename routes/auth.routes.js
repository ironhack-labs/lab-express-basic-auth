const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10

const User = require('./../models/User.model')
const { isLoggedOut } = require('../middlewares/route-guard')


// signup form (render)
router.get("/sign-up", isLoggedOut, (req, res, next) => {
    res.render("auth/signup")
})

// signup form (handler)
router.post("/sign-up", (req, res, next) => {
    const { email, rawPassword } = req.body
    console.log({ email, rawPassword })
    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(rawPassword, salt))
        .then(hashedPassword => User.create({ email, password: hashedPassword }))
        .then(() => res.redirect("/sign-in"))
        .catch(err => next(err))
})

// login form (render)
router.get("/sign-in", isLoggedOut, (req, res, next) => {
    res.render("auth/login")
})

// login form (handler)
router.post("/sign-in", (req, res, next) => {


    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fields needed' })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {

            if (!foundUser) {
                res.render('auth/login', { errorMessage: 'Unknown User' })
                return
            }

            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render('auth/login', { errorMessage: 'Incorrect password' })
                return
            }

            req.session.currentUser = foundUser // login!
            res.redirect('/profile')
        })
})
//log out
router.get('/log-out', (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
})








module.exports = router