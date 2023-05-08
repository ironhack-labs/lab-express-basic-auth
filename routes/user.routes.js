const express = require('express')
const { isLoggedIn } = require('../middlewares/route-guard')
const router = express.Router()

// profile page
router.get("/perfil", isLoggedIn, (req, res, next) => {
    res.render("user/profile", { user: req.session.currentUser })
})

//private page
router.get("/private", isLoggedIn, (req, res, next) => {
    res.render("private", { user: req.session.currentUser })
})


module.exports = router