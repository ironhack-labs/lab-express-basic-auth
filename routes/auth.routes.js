const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const saltRounds = 10

const { isLoggedOut } = require('../middleware/route-guard')


router.get("/register", isLoggedOut, (req, res) => {
    res.render("auth/signup")
})

router.post("/register", isLoggedOut, (req, res, next) => {
    const { username, email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ username, email, password: passwordHash }))
        .then(() => res.redirect("/login"))
        .catch(err => next(err))
})

router.get("/login", isLoggedOut, (req, res) => {
    res.render("auth/login")
})


router.post("/login", isLoggedOut, (req, res, next) => {
    const { email, password } = req.body

    if (email.length === 0 || password.length === 0) {
        res.render('auth/login', { errorMessage: 'Fill in all fields' })
        return
    }

    User

        .findOne({ email })
        .then(existingUser => {
            if (!existingUser) {
                res.render("auth/login", { errorMessage: "Email not found" })
                return
            }
            if (bcrypt.compareSync(password, existingUser.password) === false) {
                res.render("auth/login", { errorMessage: "Incorrect password" })
                return
            }
            req.session.currentUser = existingUser
            console.log("sesión iniciada", req.Session)
            res.redirect("/")
        })
        .catch(err => next(err))

})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})


module.exports = router