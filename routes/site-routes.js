const express = require('express')
const router = express.Router()

router.get("/", (req, res, next) => {
    res.render("home")
})

router.use((req, res, next) => {
    if (req.session.currentUser) {
        next()
    } else {
        res.redirect("/login")
    }
})

router.get("/profile", (req, res, next) => {
    res.render("auth/profile")
})

router.get("/secret", (req, res, next) => {
    res.render("auth/secret")
})


router.get("/logout", (req, res, next) => {
    req.session.destroy((err) => {

        res.redirect("/login")
    })
})

module.exports = router