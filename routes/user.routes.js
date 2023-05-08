const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

// profile page
router.get("/main", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})
router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("user/private")
})

module.exports = router