const router = require('express').Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")
const { isLoggedIn } = require('../middleware/route-guard')

router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
})

router.post("/auth/signup", (req, res, next) => {
    const { username, password } = req.body

    // Validation
    if (username === "") {
        res.render("signup", { message: "Username cannot be empty" })
        return
    }

    if (password.length < 4) {
        res.render("signup", { message: "Password must be minimum 4 characters" })
        return
    }

    // Validation passed
    User.findOne({ username })
        .then(userFromDB => {
            if (userFromDB !== null) {
                res.render("signup", { message: "Username is already taken" })
            } else {
                // Username is available
                // Hash password
                const salt = bcrypt.genSaltSync()
                const hash = bcrypt.hashSync(password, salt)
                console.log(hash)

                // Create user
                User.create({ username, password: hash })
                    .then(createdUser => {
                        res.redirect("/auth/login")
                    })
                    .catch(err => {
                        next(err)
                    })
            }
        })
})

// Login
router.get("/auth/login", (req, res, next) => {
    res.render("login")
})

router.post("/auth/login", (req, res, next) => {
    const { username, password } = req.body

    User.findOne({ username })
        .then(userFromDB => {
            if (userFromDB === null) {
                res.render("login", { message: "Wrong credentials" })
                return
            }

            // User found in database
            // Check if password from input form matches password from database
            if (bcrypt.compareSync(password, userFromDB.password)) {
                req.session.user = userFromDB
                res.redirect("/profile")
            } else {
                res.render("login", { message: "Wrong credentials" })
                return
            }
        })
        .catch(err => next(err))
})

router.get("/auth/logout", (req, res, next) => {
    // Logout user
    req.session.destroy()
    res.redirect("/")
})


module.exports = router;