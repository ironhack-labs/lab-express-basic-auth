const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const saltRounds = 10

const User = require("../models/User.model")

const { isLoggedOut } = require("../middleware/route-guard")


router.get("/signup", isLoggedOut, (req, res) => {

    res.render("auth/signup")
})

router.post("/signup", isLoggedOut, (req, res, next) => {
    const { email, plainPassword } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(plainPassword, salt))
        .then(passwordHash => User.create({ email, password: passwordHash }))
        .catch(err => console.log("not creating", err))

})

router.get("/login", isLoggedOut, (req, res) => {

    res.render("auth/login")
})


router.post("/login", isLoggedOut, (req, res, next) => {
    const { email, plainPassword } = req.body

    if (email.length === 0 | plainPassword.length === 0) {
        res.render("auth/login", { errorMessage: "Fill in all the fields" })
        return
    }

    User
        .findOne({ email })
        .then(foundUser => {
            if (!foundUser) {
                res.render("auth/login", { errorMessage: "Unregistered email " })
                return
            }

            if (bcrypt.compareSync(plainPassword, foundUser.password) === false) {
                res.render("auth/login", { errorMessage: "Incorrect password" })
                return
            }

            req.session.currentUser = foundUser
            console.log("Log in session", req.session)
            res.redirect("/")

        })
        .catch(err => next(err))

})

module.exports = router









