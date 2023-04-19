const router = require("express").Router()
const User = require("../models/User.model")
const bcrypt = require("bcryptjs")

// 1 - Sign up

router.get("/auth/signup", (req, res, next) => {
    res.render("signup")
})

// 2 = Create user page

router.post("/auth/signup", (req, res, next) => {
    const { username, password } = req.body

    // Validation
    // Check if username is empty

    if (username === "") {
        res.render("signup", { message: "Username cannot be empty" })
        return
    }

    if (password.length < 4) {
        res.render("signup", { message: "Password has to be a minimum 4 characters" })
        return
    }

    // Validation has passed
    // Check if username is already taken

    User.findOne({ username })
    .then(userFromDB => {
        if (userFromDB !== null) {
        res.render("signup", { message: "Username is already taken" })
        return
        } else {
            // Username is available
            // Hash password
            const salt = bcrypt.genSaltSync()
            console.log(salt)
            const hash = bcrypt.hashSync(password, salt)
            console.log(hash)

            // Create user
            User.create({ username, password: hash })
            .then(createdUser => {
                res.redirect("/auth/login")
            })
            .catch(err => next(err))
        }
    })
})

// 3 - Log in

router.get("/auth/login", (req, res, next) => {
    res.render("login")
})

// 4 - Login page

router.post("/auth/login", (req, res, next) => {
    const { username, password } = req.body

    // Find user in database by username
    User.findOne({ username })
    .then(userFromDB => {
        if (userFromDB === null) {
            // User not found in database => Show login here
            res.render("login", { message: "Wrong credentials" })
            return
        }
        // User found in database
        // Check if password from input form matches hashed password
        if (bcrypt.compareSync(password, userFromDB.password)) {
            // Password is correct => Login user
            req.session.user = userFromDB
            req.session.user.password = null
            console.log("This is the session: ", req.session)
            res.redirect("/profile")
        } else {
            res.render("login", { message: "Wrong credentials" })
            return
        }
    })
})

// 5 Log out user

router.get("/auth/logout", (req, res, next) => {
    // Logout user
    req.session.destroy()
    res.redirect("/")
})

module.exports = router