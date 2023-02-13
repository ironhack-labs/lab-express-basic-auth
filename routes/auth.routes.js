const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const saltRounds = 10
const User = require("../models/User.model")
const errorObject = {
    emptyEmail: "Email cannot be empty",
    emptyPassword: "Password cannot be empty",
    emptyName: "Name cannot be empty",
    incorrectData: "Incorrect username or password.",
    emailUsed: "Email already in use",
}
router.get("/signup", (req, res) => {
    res.render("auth/signup-form")
})

router.post("/signup", (req, res, next) => {
    const { name, email, userPassword } = req.body
    if (name.length === 0) {
        res.render("auth/signup-form", { emptyName: errorObject.emptyName })
        return
    } else if (email.length === 0) {
        res.render("auth/signup-form", { emptyEmail: errorObject.emptyEmail })
        return
    }
    else if (userPassword.length === 0) {
        res.render("auth/signup-form", { emptyPassword: errorObject.emptyPassword })
        return
    }
    else
        User
            .findOne({ email })
            .then(user => {
                if (user) {
                    res.render("auth/signup-form", { emailUsed: errorObject.emailUsed })
                    return
                } else {

                    bcrypt
                        .genSalt(saltRounds)
                        .then(salt => bcrypt.hash(userPassword, salt))
                        .then(passwordHash => User.create({ name, email, password: passwordHash }))
                        .then(user => req.session.currentUser = user)
                        .then(() => res.redirect('/'))
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
})


router.get("/login", (req, res) => {
    res.render("auth/login-form")
})

router.post("/login", (req, res) => {
    const { email, userPassword } = req.body
    if (email.length === 0) {
        res.render("auth/login-form", { emptyEmail: errorObject.emptyEmail })
        return
    }
    else if (userPassword.length === 0) {
        res.render("auth/login-form", { emptyPassword: errorObject.emptyPassword })
        return
    }
    User
        .findOne({ email })
        .then(user => {
            if (!user) {
                res.render('auth/login-form', { incorrectData: errorObject.incorrectData })
            } else if (!bcrypt.compareSync(userPassword, user.password)) {
                res.render('auth/login-form', { incorrectData: errorObject.incorrectData })
            }
            else {
                req.session.currentUser = user
                res.redirect('/')
            }
        })
        .catch(err => console.log(err))
})


router.get("/logout", (req, res) => req.session.destroy(() => res.redirect('/')))


module.exports = router;
