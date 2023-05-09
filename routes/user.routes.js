const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

// profile page
router.get("/profile", isLoggedIn, (req, res, next) => {
    res.render("auth/profile", { user: req.session.currentUser })
})

module.exports = router