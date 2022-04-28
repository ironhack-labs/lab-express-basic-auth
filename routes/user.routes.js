const router = require("express").Router()
const User = require('../models/User.model')

router.get("/userWelcome", (req, res) => {
        res.render("users/user-welcome")
})

router.get("/userProfile", (req, res) => {
    res.render("users/user-profile")
})

module.exports = router