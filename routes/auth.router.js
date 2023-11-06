const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const saltRounds = 10

const User = require("./../models/User.model")

router.get("/signup", (req, res) => {
    res.render("auth/signup")

})

router.post("/signup", (req, res) => {
    const { username, password } = req.body

    bcrypt
        .genSalt(saltRounds)
        .then(salt => bcrypt.hash(password, salt))
        .then(passwordHash => User.create({ username, password: passwordHash }))
        .then(() => res.redirect("/"))
        .catch(err => console.log(err))
})

router.get("/login", (req, res) => {
    res.render("auth/login")
})

router.post("/login", (req, res) => {
    const { username, password } = req.body

    if (username.length === 0 || password.length === 0) {
        res.render("auth/login", { errorMessage: "Rellena todos los campos" })
        return
    }

    User.
        findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render("auth/login", { errorMessage: "Username does not exist." })
                return
            }
            if (!bcrypt.compareSync(password, foundUser.password)) {
                res.render("auth/login", { errorMessage: "Password is incorrect." })
                return
            }
            req.session.currentUser = foundUser
            res.redirect("/")
        })
        .catch(err => console.log(err))
})

router.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/'))
})

module.exports = router