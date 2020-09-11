const express = require('express')
const router = express.Router()
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const User = require("../models/user.model")


// Endpoints
router.get('/', (req, res) => res.render('index'))


// Register
router.get("/register", (req, res) => res.render("register-page"))

router.post("/register", (req, res) => {
    const { username, password } = req.body
    User.findOne({ username })
        .then(foundUser => {
            if (foundUser) {
                res.render("register-page", { errorMessage: "The user already exist" })
                return
            }
        })
        .catch(err => console.log(`Upsi, an error happened: ${err}`))

    if (password === "" || username === "" ) {
        res.render("register-page", { errorMessage: "The password and user can't be empty" })
        return
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    User.create({ username, password: hashPass })
        .then(newUser => res.redirect("/"))
        .catch(err => console.log(`Upsi, an error happened: ${err}`))

    
})

// Login
router.get("/login", (req, res) => res.render("login-page"))

router.post("/login", (req, res) => {
    const { username, password } = req.body

    if (password === "" || username === "") {
        res.render("login-page", { errorMessage: "The password and user can't be empty" })
        return
    }
    
    User.findOne({ username })
        .then(foundUser => {
            if (!foundUser) {
                res.render("login-page", { errorMessage: "User not found" })
                return
            }
            if (bcrypt.compareSync(password, foundUser.password)) {
                req.session.currentUser = foundUser
                res.redirect("/")
            } else {
                res.render("login-page", {errorMessage: "Wrong password"})
            }
        })
    

})

module.exports = router
